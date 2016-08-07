const Field = require('./field');
const { BaseValidators, DynamicValidators } = require('./validators');

const FieldInfo = {
  Text: {
    name: 'text',
    params: { default: '' },
    validators: [(value => typeof value === 'string')],
    methods: [BaseValidators, DynamicValidators]
  }
}

for (let i in FieldInfo) {
  let field = FieldInfo[i];
  module.exports[i] = () => {
    const FieldInstance = new Field(field.name, field.params, field.validators);
    FieldInstance.bindMethods.apply(FieldInstance, field.methods);
    return FieldInstance;
  }
}
