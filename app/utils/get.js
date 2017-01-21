/* eslint-disable */
export default function get(obj, prop) {
  var parts = prop.split('.'),
    last = parts.pop(),
    falseyReturn = parts[parts.length - 1] === 'length' ? 0 : false;

  if (!obj) {
    return falseyReturn;
  }

  while (prop = parts.shift()) {
    obj = obj[prop];
    if (obj == null) {
      return falseyReturn;
    }
  }

  // we don't want to return undefined
  if (obj[last] == null) {
    return falseyReturn;
  }

  return obj[last];
}