const Model = require('./model');
const { textField } = require('./fields');

const Types = {};

Object.defineProperty(Types, 'Text', {
  get() {
    return textField();
  }
});

module.exports = (fields) => new Model(fields);

module.exports.Types = Types;
