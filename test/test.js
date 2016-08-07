const { expect } = require('chai');
const sinon = require('sinon');
const Modeler = require('../src');
const { Types } = Modeler;
const FieldMetadata = require('../src/util/FieldMetadata');
const makeRandomId = require('../src/util/makeRandomId');

describe('FieldMetadata', () => {
  it.only('test', () => {
    console.log(Types.Text.required);
    console.log(Types.Text);
  });

  describe('constructor()', () => {
    it('creates a new instance of FieldMetadata', () => {
      const Instance = new FieldMetadata();
      expect(Instance).to.be.an.instanceOf(FieldMetadata);
    });

    it('copies object properties to metadata', () => {
      const Instance = new FieldMetadata({ type: 'text' });
      expect(Instance.metadata.type).to.equal('text');
    });
  });

  describe('bindMethods()', () => {
    const Methods = {
      one: () => this
    };

    it('adds methods to this.metadata', () => {
      const Instance = new FieldMetadata();
      Instance.bindMethods(Methods);
      expect(Instance.metadata).to.have.property('one');
    });

    it('adds multiple sets of methods', () => {
      const ExtraMethods = {
        two: () => this
      };

      const Instance = new FieldMetadata();
      Instance.bindMethods(Methods, ExtraMethods);
      expect(Instance.metadata).to.have.keys(['one', 'two']);
    });

    it('binds methods to this.metadata', () => {
      const Instance = new FieldMetadata();
      Instance.bindMethods(Methods);
      sinon.spy(Instance.metadata, 'one');
    });

    it('attaches functions differently from getters', () => {

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
