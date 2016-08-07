const Field = require('../Field');
const { BaseMethods } = require('../methods');

/**
 * Add a type to `Modeler.Types`.
 * @param {Object} Types - Object that the type is added to as a property or function. This is usually `Modeler.Types`.
 * @param {String} name - Name of the type. Also the name of the property on `Types`.
 * @param {FieldDefinition} definition - Parameters for a field.
 */
module.exports = function addType(Types, name, definition) {
  // Fields that are called as functions call a constructor which modifies the field based on arguments passed to the field function
  if (Factory(definition)._constructor) {
    // Arrow functions don't expose the arguments list!
    Types[name] = function() {
      // Create an instance of this field
      const Field = Factory(definition);

      // Get the arguments passed to the field function
      const Args = Array.from(arguments);

      // Modify the field using the arguments
      Field._constructor.apply(null, [Field].concat(Args));

      // Delete the constructor for good measure
      delete Field._constructor;

      return Field;
    }
  }
  // Fields that are called as properties are set as a getter
  else {
    Object.defineProperty(Types, name, {
      get() {
        return Factory(definition);
      }
    });
  }
}

module.exports.TypeFactory = Factory;

/**
 * Generate a Field class instance from a type definition.
 * @param {TypeDefinition} definition - Type settings.
 * @return {Field} Field instance.
 */
function Factory(definition) {
  // Create a new field definition with the name, default params, and default validators of this field type
  const FieldInstance = new Field(definition.name, definition.params, definition.validators);

  // All field types have the basic chainable methods, and field type-specific chainable methods are added as well, and bound to this class instance
  FieldInstance.bindMethods.apply(FieldInstance, definition.methods.concat(BaseMethods));

  // If a field is called as a function instead of accessed as a property, store the constructor for later use
  if (definition.fn) FieldInstance.setConstructor(definition.fn);

  return FieldInstance;
}
