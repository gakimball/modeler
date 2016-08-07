/**
 * Ways to validate an object when using the Object field type.
 * @constant
 * @prop NONE - Value must be an object to be valid.
 * @prop SIMPLE - Value must be an object and have keys OR values of a specific type, or both keys AND values of a specific type.
 * @prop FULL - Value must be an object and have an exact shape.
 */
const ObjectValidations = {
  NONE: 'none',
  SIMPLE: 'simple',
  FULL: 'full'
}

module.exports = ObjectValidations;
