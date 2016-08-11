const { expect } = require('chai');
const Modeler = require('../src');
const { Types, alias } = Modeler;

describe('alias()', () => {
  before(() => {
    alias('CustomType', Types.Object.shape({
      one: Types.Text.default('one').required,
      two: Types.Number.default(2).required
    }));
  });

  after(() => {
    delete Types.CustomType;
  });

  it('adds a property to Modeler.Types', () => {
    expect(Types.CustomType).to.exist;
  });

  it('can be used in a field definition', () => {
    const model = Modeler({
      custom: Types.CustomType
    });

    expect(model.fields.custom.params.model.blank()).to.contain.keys(['one', 'two']);
  });
});
