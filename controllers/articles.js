const articleModel = require('../models/article.js');
const NotFoundError = require('../errors/not-found-err.js');
const BadReqestError = require('../errors/bad-reqest.js');
const ForbiddenError = require('../errors/forbidden-err.js');

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  articleModel.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => res.send(
      {
        data: {
          id: article._id,
          keyword: article.keyword,
          title: article.title,
          text: article.text,
          date: article.date,
          source: article.source,
          link: article.link,
          image: article.image,
        },
      },
    ))
    .catch(() => {
      next(new BadReqestError('Переданы некорректные данные'));
    });
};

module.exports.getUserArticles = (req, res, next) => {
  articleModel.find({ owner: req.user._id })
    .then((data) => res.send(data))
    .catch(() => {
      next();
    });
};

module.exports.deleteArticle = (req, res, next) => {
  articleModel.findById(req.params.id).select('+owner')
    .then((article) => {
      if (article.owner.equals(req.user._id)) {
        return articleModel.findByIdAndRemove(req.params.id)
          .then(() => res.send({ message: 'deleted' }));
      }
      return next(new ForbiddenError('Forbidden'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Нет карточки с таким id'));
      }
      return next();
    });
};
