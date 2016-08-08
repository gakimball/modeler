const { expect } = require('chai');
const Model = require('../src/Model');
const { Types } = require('../src');

describe('Model', () => {
  let Instance, Fields;

  before(() => {
    Fields = {
      value: Types.Text.default('test').required
    };
    Instance = new Model(Fields);
  })

  describe('constructor()', () => {
    it('creates a new instance of Model', () => {
      expect(Instance).to.be.an.instanceOf(Model);
    });

    it('copies constructor param to this.fields', () => {
      expect(Instance).to.have.property('fields').which.eql(Fields);
    });
  });

  describe('blank()', () => {
    it('generates a blank object using field defaults', () => {
      expect(Instance.blank()).to.have.property('value', 'test');
    });
  });

  describe('validate()', () => {
    it('validates model fields', () => {
      expect(Instance.validate({ value: 0 })).to.be.false;
    });

    it('returns false if a required field does not exist', () => {
      expect(Instance.validate({})).to.be.false;
    });
  });
});
