const { expect } = require('chai');
const Field = require('../src/Field');

describe('Field', () => {
  const Type = 'name';
  const Params = { default: 'test' };
  const Validators = [() => {}];

  describe('constructor()', () => {
    let Instance;

    before(() => {
      Instance = new Field(Type, Params, Validators);
    })

    it('creates a new instance of Field', () => {
      expect(Instance).to.be.an.instanceOf(Field);
    });

    it('copies name parameter to this.type', () => {
      expect(Instance.type).to.equal(Type);
    });

    it('extends this.params with params parameter', () => {
      expect(Instance.params).to.eql({
        required: false,
        dynamic: false,
        default: 'test'
      });
    });

    it('copies validators parameter to this.methods', () => {
      expect(Instance.validators).to.eql(Validators)
    });

    it('sets empty array for filters', () => {
      expect(Instance.filters).to.be.an('array');
    });
  });

  describe('validate()', () => {
    const ValidatorOne = (v) => v === 'test';
    const ValidatorTwo = (v) => false;

    it('returns the result of one validator', () => {
      const Instance = new Field(Type, Params, [ValidatorOne]);
      expect(Instance.validate('test')).to.be.true;
    });

    it('returns false if any validator does not pass', () => {
      const Instance = new Field(Type, Params, [ValidatorOne, ValidatorTwo]);
      expect(Instance.validate('test')).to.be.false;
    });
  });

  describe('process()', () => {
    let field;
    const Validator = (v) => typeof v === 'number';
    const Double = (n) => n * 2;
    const Triple = (n) => `$${n}`;

    before(() => {
      field = new Field('test', {}, [Validator]);
      field.filters = [Double, Triple];
    });

    it('does not filter if the value is invalid in the first place', () => {
      expect(field.process('NaN')).to.equal('NaN');
    });

    it('runs all filters in order', () => {
      expect(field.process(10)).to.equal('$20');
    });
  });

  describe('bindMethods()', () => {
    const Methods = {
      one() { return this; }
    };

    it('adds methods to this.metadata', () => {
      const Instance = new Field(Type);
      Instance.bindMethods(Methods);
      expect(Instance).to.have.property('one');
    });

    it('adds multiple sets of methods', () => {
      const ExtraMethods = {
        two() { return this; }
      };

      const Instance = new Field(Type);
      Instance.bindMethods(Methods, ExtraMethods);
      expect(Instance).to.have.property('one');
      expect(Instance).to.have.property('two');
    });

    it('binds methods to class instance', () => {
      const Instance = new Field(Type);
      Instance.bindMethods(Methods);
      expect(Instance.one).to.be.an.instanceOf(Field);
    });

    it('attaches functions differently from getters', () => {
      let functions = {
        one() { return this }
      }
      functions.one.func = true;
      const Instance = new Field(Type);
      Instance.bindMethods(functions);
      expect(Instance)
        .to.have.property('one')
        .which.is.a('function');
    });
  });

  describe('setConstructor()', () => {
    it('stores a function on this._constructor', () => {
      const Instance = new Field(Type);
      const Fn = () => {};
      Instance.setConstructor(Fn);
      expect(Instance._constructor).to.equal(Fn);
    });
  });
});
