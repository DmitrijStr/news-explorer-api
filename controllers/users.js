const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.js');
const NotFoundError = require('../errors/not-found-err.js');
const BadReqestError = require('../errors/bad-reqest.js');
const ConflictError = require('../errors/conflict-err.js');
const UnauthorizedError = require('../errors/unauthorized-err.js');
const { JWT_SECRET } = require('../configs/index.js');

module.exports.getUser = (req, res, next) => {
  userModel.findOne({ _id: req.user._id })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Нет пользователя с таким id'));
      }
      return next();
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => userModel.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => res.status(200).send({ data: { _id: user._id, email: user.email } }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        return next(new ConflictError('данный email уже зарегистрирован'));
      }
      return next(new BadReqestError('Переданы некорректные данные'));
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Переданы некорректные данные'));
    });
};
