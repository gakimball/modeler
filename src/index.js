const Model = require('./model');
const Fields = require('./fields');

const Types = {};

// Generate Modeler.Types from the list of field types
for (let i in Fields) {
  // Fields that are called as functions call a constructor which modifies the field based on arguments passed to the field function
  if (Fields[i]()._constructor) {
    // Arrow functions don't expose the arguments list!
    Types[i] = function() {
      // Create an instance of this field
      const Field = Fields[i]();

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
    Object.defineProperty(Types, i, {
      get() {
        return Fields[i]();
      }
    });
  }
}

module.exports = (fields) => new Model(fields);

module.exports.Types = Types;
