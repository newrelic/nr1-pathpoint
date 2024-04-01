/**
 * Check if the value received by parameters is an object
 * @param {object} obj Object as parameter
 * @returns {boolean} Boolean
 */
export default function isObject(obj) {
  return obj !== null && obj instanceof Object && obj.constructor === Object;
}
