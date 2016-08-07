/**
 * A series of functions that can be attached to a model definition as chainable methods.
 * @typedef {Object.<String, Function>} MethodList
 */

/**
 * Chainable functions used by all types.
 * @type MethodList
 */
let BaseMethods = {
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
let DynamicMethods = {
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

/**
 * Chainable functions used by numeric types.
 * @type MethodList
 */
let NumberMethods = {
  /**
   * Requires a number to be between two values (inclusive).
   * @param {Number} min - Minimum value.
   * @param {Number} max - Maximum value.
   */
  between(min, max) {
    this.validators.push(n => n >= min && n <= max);
    return this;
  },

  /**
   * Requires a number to be greater than or equal to a value.
   * @param {Number} min - Minimum value.
   */
  atLeast(min) {
    this.validators.push(n => n >= min);
    return this;
  },

  /**
   * Requires a number to be less than or equal to a value.
   * @param {Number} max - Maximum value.
   */
  atMost(max) {
    this.validators.push(n => n <= max);
    return this;
  }
}

NumberMethods.between.func = true;
NumberMethods.atLeast.func = true;
NumberMethods.atMost.func = true;

/**
 * Chainable functions used by series types.
 * @type MethodList
 */
let SeriesMethods = {
  /**
   * Requires all items in a series to be of a certain type.
   * @type {Type} type - Type to validate with.
   */
  of(type) {
    this.params.validType = type;

    this.validators.push(a => {
      const results = a.map(v => type.validate(v));
      return results.indexOf(false) === -1;
    });

    return this;
  }
}

SeriesMethods.of.func = true;

module.exports = { BaseMethods, DynamicMethods, NumberMethods, SeriesMethods };
