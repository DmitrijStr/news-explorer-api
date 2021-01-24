const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUser } = require('../controllers/users.js');

usersRouter.get('/me', celebrate({
  headers: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }).unknown(true),
}), getUser);

module.exports = usersRouter;
