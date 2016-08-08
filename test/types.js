const { expect } = require('chai');
const Types = require('../src/types');

const TypeObject = {
  name: '',
  params: {
    default: '',
    required: false,
    dynamic: false
  },
  validators: [],
  filters: []
};

describe('Types', () => {
  describe('Text', () => {
    describe('validator', () => {
      const fn = Types.Text.validators[0];

      it('strings are valid', () => {
        expect(fn('string')).to.be.true;
      });

      it('non-strings are invalid', () => {
        expect(fn(0)).to.be.false;
        expect(fn(true)).to.be.false;
        expect(fn(null)).to.be.false;
        expect(fn([])).to.be.false;
        expect(fn({})).to.be.false;
      });
    });
  });

  describe('Number', () => {
    describe('validator', () => {
      const fn = Types.Number.validators[0];

      it('numbers are valid', () => {
        expect(fn(0)).to.be.true;
      });

      it('non-strings are invalid', () => {
        expect(fn('string')).to.be.false;
        expect(fn(true)).to.be.false;
        expect(fn(null)).to.be.false;
        expect(fn([])).to.be.false;
        expect(fn({})).to.be.false;
      });
    });
  });

  describe('Option', () => {
    const Options = ['one', 'two', 'three'];

    describe.skip('validator', () => {
      const Instance = {
        params: { options: Options }
      };
      const fn = Types.Option.validators[0].bind(Instance);

      it('value in option list is valid', () => {
        expect(fn('one')).to.be.true;
      });

      it('value not in option list in invalid', () => {
        expect(fn('four')).to.be.false;
      });
    });

    describe('constructor', () => {
      const fn = Types.Option.fn;

      it('accepts arguments as an array', () => {
        let Instance = Object.assign({}, TypeObject);
        fn(Instance, Options);
        expect(Instance.params.options).to.eql(Options);
      });

      it('accepts arguments as multiple parameters', () => {
        let Instance = Object.assign({}, TypeObject);
        fn.apply(null, [Instance].concat(Options));
        expect(Instance.params.options).to.eql(Options);
      });

      it('sets the first option as the default', () => {
        let Instance = Object.assign({}, TypeObject);
        fn(Instance, Options);
        expect(Instance.params.default).to.eql(Options[0]);
      });
    });
  });
});
