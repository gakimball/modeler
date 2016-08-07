const makeRandomId = require('./util/makeRandomId');

module.exports = class Model {
  constructor(fields) {
    this.fields = fields;
  }

  blank() {
    let model = {};
    model._id = makeRandomId();

    for (let name in this.fields) {
      let field = this.fields[name];
      model[name] = field.default();
    }

    return model;
  }

  validate() {
    let valid = true;

    for (let i in this.fields) {
      valid = this.fields[i].validate();
    }

    return valid;
  }
}
