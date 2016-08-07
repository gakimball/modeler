const Field = require('./field');
const { BaseMethods, DynamicMethods, NumberMethods } = require('./methods');

/**
 * Properties to pass to the `Field` class when creating an instance of a specific field type.
 * @todo Determine if "name" is ever used
 * @typedef {Object} FieldDefinition
 * @prop {String} name - Name of the field type.
 * @prop {Object.<String, *>} params - Overrides to the default parameters of a field type.
 * @prop {Validator[]} validators - Base-level validation checks for this field type.
 * @prop {MethodList[]} methods - Chainable methods usable by this field.
 */

/**
 * Field types with default settings.
 * @constant
 * @private
 * @type Object.<String, FieldDefinition>
 */
const FieldInfo = {
  /**
   * String field type. Base validator checks if a value is a string.
   */
  Text: {
    name: 'text',
    params: { default: '' },
    validators: [(value => typeof value === 'string')],
    methods: [DynamicMethods]
  },

  /**
   * String field type. Base validator checks if a value is a string.
   */
  Number: {
    name: 'number',
    params: { default: '' },
    validators: [(value => typeof value === 'number')],
    methods: [DynamicMethods, NumberMethods]
  }
}

// module.exports is produced using the properties above
for (let i in FieldInfo) {
  let field = FieldInfo[i];

  module.exports[i] = () => {
    // Create a new field definition with the name, default params, and default validators of this field type
    const FieldInstance = new Field(field.name, field.params, field.validators);

    // All field types have the basic chainable methods, and field type-specific chainable methods are added as well, and bound to this class instance
    FieldInstance.bindMethods.apply(FieldInstance, field.methods.concat(BaseMethods));

    return FieldInstance;
  }
}
