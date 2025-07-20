/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */

const pick = (_object: object, keys: string[]) => {
  return keys.reduce((obj, key) => {
    if (_object && Object.prototype.hasOwnProperty.call(_object, key)) {
      obj[key as keyof typeof obj] = _object[key as keyof typeof obj];
    }
    return obj;
  }, {});
};

export default pick;
