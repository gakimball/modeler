const { expect } = require('chai');
const sinon = require('sinon');
const Modeler = require('../src');
const Model = require('../src/Model');
const Field = require('../src/Field');
const { Types } = Modeler;
const { BaseValidators, DynamicValidators } = require('../src/validators');
const makeRandomId = require('../src/util/makeRandomId');

describe('Modeler', () => {
  it('is a wrapper around Model', () => {
    expect(Modeler({})).to.be.an.instanceOf(Model);
  });

  it('has a Types property', () => {
    expect(Modeler).to.have.property('Types').which.is.an('object');
  });
});

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

    it('copies validators parameter to this.validators', () => {
      expect(Instance.validators).to.eql(Validators)
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

  describe('bindMethods()', () => {
    const Methods = {
      one() { return this; }
    };

    it('adds methods to this.metadata', () => {
      const Instance = new Field(Type, {}, []);
      Instance.bindMethods(Methods);
      expect(Instance).to.have.property('one');
    });

    it('adds multiple sets of methods', () => {
      const ExtraMethods = {
        two() { return this; }
      };

      const Instance = new Field(Type, {}, []);
      Instance.bindMethods(Methods, ExtraMethods);
      expect(Instance).to.have.property('one');
      expect(Instance).to.have.property('two');
    });

    it('binds methods to class instance', () => {
      const Instance = new Field(Type, {}, []);
      Instance.bindMethods(Methods);
      expect(Instance.one).to.be.an.instanceOf(Field);
    });

    it('attaches functions differently from getters', () => {
      let functions = {
        one() { return this }
      }
      functions.one.func = true;
      const Instance = new Field(Type, {}, []);
      Instance.bindMethods(functions);
      expect(Instance)
        .to.have.property('one')
        .which.is.a('function');
    });
  });
});

describe('Model', () => {
  let Instance;
  const Fields = {
    value: Types.Text.default('test')
  };

  before(() => {
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
  });
});

describe('Field methods', () => {
  describe('required', () => {
    it('sets this.params.required to true', () => {
      const Input = { params: { required: false } };
      const Expected = { params: { required: true } };
      expect(BaseValidators.required.call(Input)).to.eql(Expected);
    });
  });

  describe('default', () => {
    it('sets this.params.default to given value', () => {
      const Input = { params: { default: '' } };
      const Expected = { params: { default: 'test' } };
      expect(BaseValidators.default.call(Input, 'test')).to.eql(Expected);
    });
  });

  describe('dynamic', () => {
    it('sets this.params.dynamic to true', () => {
      const Input = { params: { dynamic: false } };
      const Expected = { params: { dynamic: true } };
      expect(DynamicValidators.dynamic.call(Input)).to.eql(Expected);
    });
  });
});

describe('makeRandomId()', () => {
  it('generates a six-character string', () => {
    expect(makeRandomId()).to.be.a('string');
    expect(makeRandomId()).to.have.lengthOf(6);
  });

  it('generates a unique string each time', () => {
    expect(makeRandomId()).to.not.equal(makeRandomId());
  });
});
