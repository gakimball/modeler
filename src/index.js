const Model = require('./Model');
const types = require('./types');
const addType = require('./util/addType');
const Types = {};

// Generate Modeler.Types from the list of field types
for (let i in types) {
  addType(Types, i, types[i]);
}

// Main export: function to create a model
module.exports = (fields) => new Model(fields);

// Function to add custom types
module.exports.type = (name, dfn) => addType.call(null, Types, name, dfn);

// Object of available types
module.exports.Types = Types;
