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
   * @type FieldDefinition
   */
  Text: {
    name: 'text',
    params: { default: '' },
    validators: [(value => typeof value === 'string')],
    methods: [DynamicMethods]
  },

  /**
   * String field type. Base validator checks if a value is a string.
   * @type FieldDefinition
   */
  Number: {
    name: 'number',
    params: { default: '' },
    validators: [(value => typeof value === 'number')],
    methods: [DynamicMethods, NumberMethods]
  },

  /**
   * Option field type. Base validator checks if a value is one of the options.
   * This type is called as a function instead of a property.
   * @type FieldDefinition
   */
  Option: {
    name: 'option',
    params: { default: '', options: [] },
    validators: [(value => this.params.options.indexOf(value) > -1)],
    methods: [],
    /**
     * Defines the possible values of an option field. Can be passed as an array or multiple arguments.
     * Also sets an initial default value for the field, but this can be changed with `default()`.
     * @param {Array} options - Possible values for this field.
     */
    fn(instance, options)  {
      if (Array.isArray(options)) {
        instance.params.options = options;
      }
      else {
        instance.params.options = Array.from(arguments).slice(1);
      }

      instance.params.default = instance.params.options[0];
    }
  },

  /**
   * Boolean field type. Base validator checks if a value is a boolean.
   * @type FieldDefinition
   */
  Flag: {
    name: 'flag',
    params: { default: false },
    validators: [(value => typeof value === 'bolean')],
    methods: []
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

    // If a field is called as a function instead of accessed as a property, store the constructor for later use
    if (field.fn) FieldInstance.setConstructor(field.fn);

    return FieldInstance;
  }
}
