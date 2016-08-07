const Model = require('./Model');
const ObjectValidations = require('./util/ObjectValidations');

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

/**
 * Chainable functions used by object types.
 * @type MethodList
 */
let ObjectMethods = {
  /**
   * Require an object to only have keys of a certain type.
   * @todo Object keys are always converted to strings, so extra work needs to be done to validate numeric keys
   * @param {Type} type - Type to restrict keys to.
   */
  keys(type) {
    if (this.params.validationType === ObjectValidations.FULL) {
      throw new Error('Error when creating Object field: keys() cannot be called after shape(). Either define a set of valid keys/values, or a valid shape, but not both.');
    }

    this.validators.push(v => {
      const results = Object.keys(v).map(k => type.validate(k));
      return results.indexOf(false) === -1;
    });

    this.params.validationType = ObjectValidations.SIMPLE;

    return this;
  },

  /**
   * Require an object to only have values of a certain type.
   * @param {Type} type - Type to restrict values to.
   */
  values(type) {
    if (this.params.validationType === ObjectValidations.FULL) {
      throw new Error('Error when creating Object field: values() cannot be called after shape(). Either define a set of valid keys/values, or a valid shape, but not both.');
    }

    this.validators.push(v => {
      let valid = true;
      for (let i in v) {
        valid = type.validate(v[i]);
      }
      return valid;
    });

    this.params.validationType = ObjectValidations.SIMPLE;

    return this;
  },

  /**
   * Require an object to have an exact shape.
   * @param {Object} fields - Object shape, as a model.
   */
  shape(fields) {
    if (this.params.validationType === ObjectValidations.SIMPLE) {
      throw new Error('Error when creating Object field: keys() cannot be called after shape(). Either define a set of valid keys/values, or a valid shape, but not both.');
    }

    const model = new Model(fields);
    this.validators.push(v => model.validate(v));

    this.params.validationType = ObjectValidations.FULL;

    return this;
  }
}

ObjectMethods.keys.func = true;
ObjectMethods.values.func = true;
ObjectMethods.shape.func = true;

module.exports = { BaseMethods, DynamicMethods, NumberMethods, SeriesMethods, ObjectMethods };
