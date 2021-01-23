const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: function validate(v) {
        return /https?:\/\/(\d|\w)+[.\-/\d\w]+/g.test(v);
      },
      message: (props) => `${props.value} is not a valid url!`,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: function validate(v) {
        return /https?:\/\/(\d|\w)+[.\-/\d\w]+/g.test(v);
      },
      message: (props) => `${props.value} is not a valid url!`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    select: false,
    ref: 'user',
  },
});

const articleModel = mongoose.model('article', articleSchema);
module.exports = articleModel;
