module.exports.joiUrlTest = (value) => {
  if (!/https?:\/\/(\d|\w)+[.\-/]+.+/g.test(value)) {
    throw new Error('not a valid url');
  }
  return value;
};
