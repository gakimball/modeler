const { expect } = require('chai');
const { BaseMethods, DynamicMethods, NumberMethods } = require('../src/methods');

describe('Field methods', () => {
  describe('required', () => {
    it('sets this.params.required to true', () => {
      const Input = { params: { required: false } };
      const Expected = { params: { required: true } };
      expect(BaseMethods.required.call(Input)).to.eql(Expected);
    });
  });

  describe('default', () => {
    it('sets this.params.default to given value', () => {
      const Input = { params: { default: '' } };
      const Expected = { params: { default: 'test' } };
      expect(BaseMethods.default.call(Input, 'test')).to.eql(Expected);
    });
  });

  describe('dynamic', () => {
    it('sets this.params.dynamic to true', () => {
      const Input = { params: { dynamic: false } };
      const Expected = { params: { dynamic: true } };
      expect(DynamicMethods.dynamic.call(Input)).to.eql(Expected);
    });
  });

  describe('filter', () => {
    it('adds a function to this.filters', () => {
      const Fn = () => {};
      const Input = { filters: [] };
      const Expected = { filters: [Fn] };
      expect(DynamicMethods.filter.call(Input, Fn)).to.eql(Expected);
    });
  });

  describe('between', () => {
    it('adds a function to check if n is <= max and >= min', () => {
      const Input = { validators: [] };
      const { validators } = NumberMethods.between.call(Input, 0, 1);
      expect(validators[0](0)).to.be.true;
      expect(validators[0](0.5)).to.be.true;
      expect(validators[0](1)).to.be.true;
      expect(validators[0](2)).to.be.false;
    });
  });

  describe('atLeast', () => {
    it('adds a function to check if n is >= min', () => {
      const Input = { validators: [] };
      const { validators } = NumberMethods.atLeast.call(Input, 0);
      expect(validators[0](0)).to.be.true;
      expect(validators[0](1)).to.be.true;
      expect(validators[0](-1)).to.be.false;
    });
  });

  describe('atMost', () => {
    it('adds a function to check if n is <= max', () => {
      const Input = { validators: [] };
      const { validators } = NumberMethods.atMost.call(Input, 1);
      expect(validators[0](0)).to.be.true;
      expect(validators[0](1)).to.be.true;
      expect(validators[0](2)).to.be.false;
    });
  });
});
