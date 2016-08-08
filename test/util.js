const { expect } = require('chai');
const Field = require('../src/field');
const addType = require('../src/util/addType');
const makeRandomId = require('../src/util/makeRandomId');

describe('addType()', () => {
  const TypeName = 'test';
  const StubMethods = {
    method() { return this; }
  };
  const Defn = {
    name: 'text',
    params: { default: '' },
    validators: [(value => true)],
    methods: [StubMethods]
  };

  it('adds a plain type as a getter property on Types', () => {
    let Types = {};
    addType(Types, TypeName, Defn);
    const Prop = Object.getOwnPropertyDescriptor(Types, TypeName);
    expect(Prop).to.have.property('get').which.is.a('function');
  });

  it('adds a function type as a standard property on Types', () => {
    let Types = {};
    addType(Types, TypeName, Object.assign({}, Defn, { fn: () => {} }));
    const Prop = Object.getOwnPropertyDescriptor(Types, TypeName);
    expect(Prop).to.have.property('value').which.is.a('function');
  });
});

describe('TypeFactory()', () => {
  const { TypeFactory } = addType;
  const StubMethods = {
    method() { return this; }
  };
  const Params = {
    name: 'test',
    params: { default: 'test' },
    validators: [() => {}],
    methods: [StubMethods]
  };
  let Type;

  before(() => {
    Type = TypeFactory(Params);
  });

  it('creates an instance of a Field from metadata', () => {
    expect(Type).to.be.an.instanceOf(Field);
  });

  it('copies type to Field', () => {
    expect(Type.type).to.equal(Params.name);
  });

  it('extends default params with custom ones', () => {
    expect(Type.params).to.eql({
      default: 'test',
      required: false,
      dynamic: false
    });
  });

  it('sets default validators', () => {
    expect(Type.validators).to.eql(Params.validators);
  });

  it('includes base methods', () => {
    expect(Type).to.have.property('required');
    expect(Type.default).to.be.a('function');
  });

  it('adds custom methods', () => {
    expect(Type).to.have.property('method');
  });

  it('stores constructor if it exists', () => {
    const Fn = () => true;
    const Param = Object.assign({}, Params, { fn: Fn });
    const Type = TypeFactory(Param);
    expect(Type._constructor()).to.be.true;
  });
});

describe('makeRandomId()', () => {
  it('generates a six-character string', () => {
    expect(makeRandomId()).to.be.a('string');
    expect(makeRandomId()).to.have.length.within(5, 6);
  });

  it('generates a unique string each time', () => {
    expect(makeRandomId()).to.not.equal(makeRandomId());
  });
});
