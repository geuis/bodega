// inspired by https://github.com/epoberezkin/fast-deep-equal/blob/master/index.js
const fastEqual = (a, b) => {
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

export {fastEqual};
