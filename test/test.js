const { expect } = require('chai');
const Modeler = require('../src');
const { Types } = Modeler;
const { Field } = require('../src/model');

describe('Fields', () => {
  describe('Text', () => {
    it('creates a text field definition', () => {
      const model = Modeler({
        key: Types.Text.required,
        value: Types.Text.dynamic.required.default('default')
      });

      console.log(model.blank());
    });
  });
});
