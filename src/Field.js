module.exports = class Field {
  /**
   * Creates a new Field instance.
   * @constructor
   * @param {Object} field - Overrides to default field metadata.
   */
  constructor(type, params, validators) {
    this.type = type;
    this.params = Object.assign({}, {
      required: false,
      dynamic: false,
      default: ''
    }, params);
    this.validators = validators;
  }

  /**
   * Check if a value is valid according to this field's rules.
   * @param {*} value - Value to check.
   * @returns {Boolean} `true` if valid, `false` otherwise.
   */
  validate(value) {
    let valid = true;

    for (let validator of this.metadata.validators) {
      valid = validator(value);
    }

    return valid;
  }

  /**
   * Given one or more objects of methods, assign them to `this.metadata` as either functions or properties with getters.
   * @param {...MethodList} methods - Methods to add.
   */
  bindMethods(methods) {
    const MethodLists = Array.from(arguments);

    for (let list of MethodLists) {
      for (let name in list) {
        if (list[name].func) {
          this[name] = list[name].bind(this);
        }
        else {
          Object.defineProperty(this, name, {
            get: list[name].bind(this)
          });
        }
      }
    }
  }
}
