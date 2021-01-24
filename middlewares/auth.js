const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err.js');
const { JWT_SECRET } = require('../configs/index.js');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('С токеном что-то не так'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('С токеном что-то не так'));
  }

  req.user = payload;

  return next();
};
