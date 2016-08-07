const Model = require('./model');
const Fields = require('./fields');

const Types = {};

for (let i in Fields) {
  Object.defineProperty(Types, i, {
    get() {
      return Fields[i]();
    }
  });
}

module.exports = (fields) => new Model(fields);

module.exports.Types = Types;