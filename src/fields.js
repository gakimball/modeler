const FieldMetadata = require('./util/FieldMetadata');
const { BaseValidators, DynamicValidators } = require('./validators');

/**
 * Creates a text field definition.
 * @returns {Object} Initial field definition.
 */
module.exports.textField = function textField() {
  const Field = new FieldMetadata({ type: 'text' });
  Field.bindMethods(BaseValidators, DynamicValidators);
  return Field.metadata;
}
