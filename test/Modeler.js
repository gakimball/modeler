const { expect } = require('chai');
const Modeler = require('../src');
const Model = require('../src/model');

describe('Modeler', () => {
  it('is a wrapper around Model', () => {
    expect(Modeler({})).to.be.an.instanceOf(Model);
  });

  it('has a Types property', () => {
    expect(Modeler).to.have.property('Types').which.is.an('object');
  });
});
