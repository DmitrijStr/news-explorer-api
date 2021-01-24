const articleRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { joiUrlTest } = require('../utils/utils.js');
const {
  createArticle,
  getUserArticles,
  deleteArticle,
} = require('../controllers/articles.js');

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }).unknown(true),
});

articleRouter.get('/', getUserArticles);

articleRouter.delete('/:id', validateId, deleteArticle);

articleRouter.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(joiUrlTest),
    image: Joi.string().required().custom(joiUrlTest),

  }),
}), createArticle);

module.exports = articleRouter;
