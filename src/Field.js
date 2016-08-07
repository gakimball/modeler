/**
 * Definition for a field model. Contains metadata about the field's requirements and special properties, as well as a series of validators that can be run to validate a value.
 * @class
 */
module.exports = class Field {
  /**
   * Create a new Field instance.
   * @constructor
   * @param {String} type - Field type.
   * @param {Object} params - Overrides to default field parameters.
   * @param {Function[]} validators - Baseline validators for this field.
   */
  constructor(type, params = {}, validators = []) {
    this.type = type;
    this.params = Object.assign({}, {
      required: false,
      dynamic: false,
      default: ''
    }, params);
    this.validators = validators;
    this.filters = [];
  }

  /**
   * Check if a value is valid according to this field's rules.
   * @todo Be more explicit about why validation failed.
   * @param {*} value - Value to check.
   * @returns {Boolean} `true` if valid, `false` otherwise.
   */
  validate(value) {
    let valid = true;

    // The first validator is a basic type check. If this one fails, the other ones might fail because the values type as wrong, so we skip them and just return false
    if (!this.validators[0](value)) return false;

    for (let validator of this.validators.slice(1)) {
      valid = validator(value);
    }

    return valid;
  }

  /**
   * Process a value through this field's filters.
   * @param {*} value - Raw value to process.
   * @returns {*} Filtered value.
   */
  process(value) {
    if (!this.validate(value)) return value;
    let returnValue = value;
    for (let filter of this.filters) {
      returnValue = filter(returnValue);
    }
    return returnValue;
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

  /**
   * Store a temporary reference to a field constructor function.
   * Some fields are referenced as functions instead of properties, because some initial info needs to be passed to the field. For example, `Types.Text` is referenced as a property, but `Types.Option()` is called as a function, so the user can pass in what the options are.
   * For the latter instance, the function that processes those values is stored here, and called when a field instance is being created.
   * The `_constructor` property is removed after it's used.
   * @private
   * @param {Function} fn - Field constructor function.
   */
  setConstructor(fn) {
    this._constructor = fn;
  }
}
