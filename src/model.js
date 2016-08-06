const makeRandomId = require('./util/makeRandomId');

class Model {
  constructor(fields) {
    this.fields = this.constructor.processFields(fields);
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

  static processFields(fields) {
    let fieldList = {};

    for (let name in fields) {
      fieldList[name] = new Field(name, fields[name]);
    }

    return fieldList;
  }
}

class Field {
  /**
   * Creates a new Field instance.
   * @constructor
   * @param {String} name - Name of the field within the model.
   * @param {Object} field - Field definition.
   */
  constructor(name, field) {
    this.name = name;
    this.metadata = field;
  }

  /**
   * Check if a value is valid according to this field's rules.
   * @param {*} value - Value to check.
   * @returns {Boolean} `true` if valid, `false` otherwise.
   */
  validate(value) {
    let valid = true;

    for (let validator in this.metadata.validators) {
      valid = validator(value);
    }

    return valid;
  }

  /**
   * Get the default value of this field.
   * @returns {*} Default value.
   */
  default() {
    return this.metadata.params.default;
  }

  /**
   * Check if this field is required.
   * @returns {Boolean} `true` if required, `false` otherwise.
   */
  required() {
    return this.metadata.params.required;
  }
}

/**
 * Create a model using an object of fields.
 * @param {Object} fields - Fields to process.
 * @returns {Model} Model instance.
 */
module.exports = Model;

module.exports.Field = Field;
