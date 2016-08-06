/**
 * A series of functions that can be attached to a model definition as chainable methods.
 * @typedef MethodList
 * @type {Object.<Function>}
 */

/**
 * Chainable functions used by all types.
 * @type MethodList
 */
BaseValidators = {
  /**
   * Makes a field required.
   */
  required() {
    this.params.required = true;
    return this;
  },

  /**
   * Sets a default value for a field.
   */
  default(value) {
    this.params.default = value;
    return this;
  }
}

BaseValidators.default.func = true;

/**
 * Chainable functions used by types that support dynamic values.
 * @type MethodList
 */
DynamicValidators = {
  /**
   * Defines a field as being dynamic, making it filterable.
   */
  dynamic() {
    this.params.dynamic = true;
    return this;
  }
}

module.exports = { BaseValidators, DynamicValidators }
