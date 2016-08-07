/**
 * A series of functions that can be attached to a model definition as chainable methods.
 * @typedef {Object.<String, Function>} MethodList
 */

/**
 * Chainable functions used by all types.
 * @type MethodList
 */
BaseMethods = {
  /**
   * Makes a field required.
   */
  required() {
    this.params.required = true;
    return this;
  },

  /**
   * Sets a default value for a field.
   * @param {*} value - Default value.
   */
  default(value) {
    this.params.default = value;
    return this;
  }
}

BaseMethods.default.func = true;

/**
 * Chainable functions used by types that support dynamic values.
 * @type MethodList
 */
DynamicMethods = {
  /**
   * Defines a field as being dynamic, making it filterable.
   */
  dynamic() {
    this.params.dynamic = true;
    return this;
  },

  /**
   * Adds a filter to a field.
   * @param {Function} Filter function.
   */
  filter(fn) {
    this.filters.push(fn);
    return this;
  }
}

DynamicMethods.filter.func = true;

module.exports = { BaseMethods, DynamicMethods }