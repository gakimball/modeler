/**
 * Generate a unique ID for use in a model instance.
 * @returns {String} Unique ID.
 */
module.exports = function makeUniqueID() {
  return Math.floor(Math.random()*16777215).toString(16);
}
