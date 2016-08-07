const makeRandomId = require('./util/makeRandomId');

/**
 * Model instance, which can generate blank objects fitting the model's shape, and validate an object's shape.
 * @class
 */
module.exports = class Model {
  /**
   * Create a new Model, storing an object of fields passed into it.
   * @param {Object.<String,Field>} Fields for this model.
   * @constructor
   */
  constructor(fields) {
    this.fields = fields;
  }

  /**
   * Generate a blank object fitting the model's shape.
   * @returns {Object} Blank model instance.
   */
  blank() {
    let model = {};
    model._id = makeRandomId();

    for (let name in this.fields) {
      let field = this.fields[name];
      model[name] = field.params.default;
    }

    return model;
  }

  /**
   * Validate the properties of an object according to the model's rules.
   * @param {Object} value - Object to validate.
   * @returns {Boolean} `true` if all fields are valid, or `false` if at least one field is invalid.
   */
  validate(value) {
    let valid = true;

    for (let i in this.fields) {
      valid = this.fields[i].validate(value[i]);
    }

    return valid;
  }
}
