/**
 * Helper class to create a unique field metadata object.
 * @class
 */
module.exports = class FieldMetadata {
  /**
   * Creates a new field metadata wrapper, extending the default metadata properties with field-specific properties.
   * @param {Object} object - Extra properties to add.
   */
  constructor(object = {}) {
    this.metadata = Object.assign({}, {
      type: '',
      params: {
        required: false,
        dynamic: false,
        default: ''
      },
      validators: {}
    }, object);
  }

  /**
   * Given one or more objects of methods, assign them to `this.metadata` as either functions or properties with getters.
   * @param {...MethodList} methods - Methods to add.
   */
  bindMethods(methods) {
    const MethodLists = Array.from(arguments);

    for (let list of MethodLists) {
      for (let name in list) {
        if (list[name].func) {
          this.metadata[name] = list[name].bind(this.metadata)
        }
        else {
          Object.defineProperty(this.metadata, name, {
            get: list[name].bind(this.metadata)
          });
        }
      }
    }
  }
}
