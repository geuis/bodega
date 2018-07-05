// adapted from https://github.com/epoberezkin/fast-deep-equal/blob/master/index.js
const fastEqual = (a, b) => {
  if (a === b) {
    return true;
  }

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const arrA = Array.isArray(a);
    const arrB = Array.isArray(b);
    let i, length, key;

    // compare arrays
    if (arrA && arrB) {
      length = a.length;

      if (length !== b.length) {
        return false;
      }

      for (i = length; i-- !== 0;) {
        if (!fastEqual(a[i], b[i])) {
          return false;
        }
      }

      return true;
    }

    if (arrA !== arrB) {
      return false;
    }

    // compare dates
    const dateA = a instanceof Date;
    const dateB = b instanceof Date;

    if (dateA !== dateB) {
      return false;
    }

    if (dateA && dateB) {
      return a.getTime() === b.getTime();
    }

    // compare regular expressions
    const regexpA = a instanceof RegExp;
    const regexpB = b instanceof RegExp;

    if (regexpA !== regexpB) {
      return false;
    }

    if (regexpA && regexpB) {
      return a.toString() === b.toString();
    }

    const keys = Object.keys(a);
    length = keys.length;

    if (length !== Object.keys(b).length)
      return false;

    for (i = length; i-- !== 0;) {
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) {
        return false;
      }
    }

    for (i = length; i-- !== 0;) {
      key = keys[i];

      if (!fastEqual(a[key], b[key])) {
        return false;
      }
    }

    return true;
  }

  return a !== a && b !== b;
};

// https://jsperf.com/while-negation/1
const fastEqual2 = (a, b) => {
  // primitives check
  if (
    a === b ||
    Number.isNaN(a) && Number.isNaN(b)
  ) {
    return true;
  }

  if (a === null || a === undefined || b === null || b === undefined) {
    if (a !== b) {
      return false;
    }
  }

  // arrays check
  if (Array.isArray(a) && Array.isArray(b)) {
    // length 
    if (a.length !== b.length) {
      return false;
    }

    for (let i = a.length; i--;) {
      if (!fastEqual(a[i], b[i])) {
        return false;
      }
    }

    return true;
  }

  // object check
  if (a.constructor === Object && b.constructor === Object) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) {
      return false;
    }

    for (let i = aKeys.length; i--;) {      
      // if (!Object.prototype.hasOwnProperty.call(b, aKeys[i]) || !fastEqual(a[aKeys[i]], b[aKeys[i]])) {
      if (!(aKeys[i] in b) || !fastEqual(a[aKeys[i]], b[aKeys[i]])) {
        return false;
      }
    }

    return true;
  }
  
  // date check
  if (a.constructor === Date && b.constructor === Date) {
    if (a.getTime() !== b.getTime()) {
      return false;
    }

    return true;
  }
  
  // regular expression check
  if (a.constructor === RegExp && b.constructor === RegExp) {
    if (a.toString() !== b.toString()) {
      return false;
    }

    return true;
  }

  return false;
};

// export default fastEqual;
export {fastEqual, fastEqual2}
