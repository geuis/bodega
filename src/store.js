// Proxy
// getter/setter only detects top level property
//   - setting sub property doesn't trigger setter
// modifying arrays directly doesn't trigger setter

// store is always deep frozen with Object.freeze.
//   - enforces app code to always copy values
// properties are always top level
//   - primarily due to how getters work on objects and arrays
//   - objects and arrays should always be copied entirely. When updating a
//     property on an object, the entire object must be set.

import {fastEqual} from './util/fast-deep-equal';

const Proxy = window.Proxy || global.Proxy || undefined;

if (!Proxy) {
  throw new Error('Proxy is not supported in this environment.');
}

const isObject = (value) => value && value.constructor === Object;

const deepFreeze = (obj) => {
  if (Array.isArray(obj)) {
    for (let i = obj.length; i--;) {
      if (isObject(obj[i]) || Array.isArray(obj[i])) {
        obj[i] = deepFreeze(obj[i]);
      }
    }

    return Object.freeze(obj);
  }

  if (isObject(obj)) {
    const keys = Object.keys(obj);

    for (let i = keys.length; i--;) {
      const key = keys[i];

      if (isObject(obj[key]) || Array.isArray(obj[key])) {
        obj[key] = deepFreeze(obj[key]);
      }
    }

    return Object.freeze(obj);
  }

  if (obj && obj.constructor === Date) {
    return new Date(obj);
  }

  return obj;
};

const deepUnfreeze = (obj) => {
  if (Array.isArray(obj)) {
    const newArray = [...obj];

    for (let i = newArray.length; i--;) {
      if (isObject(newArray[i]) || Array.isArray(newArray[i])) {
        newArray[i] = deepUnfreeze(newArray[i]);
      }
    }

    return newArray;
  }

  if (isObject(obj)) {
    const newObject = Object.assign({}, obj);
    const keys = Object.keys(newObject);

    for (let i = keys.length; i--;) {
      const key = keys[i];

      if (isObject(newObject[key]) || Array.isArray(newObject[key])) {
        newObject[key] = deepUnfreeze(newObject[key]);
      }
    }

    return newObject;
  }

  if (obj && obj.constructor === Date) {
    return new Date(obj);
  }

  return obj;
};

const reRender = (nextState) => {
  for (const componentId in componentCache) {
    // only re-render component if it has passed mapStore arguments
    if (
      Array.isArray(mapStoreCache[componentId]) &&
      mapStoreCache[componentId].length > 0
    ) {
      for (let i = mapStoreCache[componentId].length; i--;) {
        if (mapStoreCache[componentId][i] in nextState) {
          componentCache[componentId]();
          // don't need to re-render again after first property change detected
          break;
        }
      }
    }
  }
};

export const componentCache = {};

export const mapStoreCache = {};

export const store = new Proxy({}, {
  get: (target, name) => {
    // `state` is a reserved property that returns an immutable copy of 
    // the entire store.
    if (name === 'state') {
      return Object.freeze(Object.assign({}, target));
    }

    // NOTE: consider other data types that need special handling   
    return deepUnfreeze(target[name]);
  },
  set: (target, name, value) => {
    if (name === 'state') {
      if (!isObject(value)) {
        throw new Error('"state" property must be an object literal.');
      }

      target = Object.assign(target, value);

      return true;
    }

    if (fastEqual(target[name], value)) {
      return true;
    }

    // NOTE: consider other data types that need special handling
    target[name] = deepFreeze(value);

    reRender({
      [name]: target[name]
    });

    return true;
  }
});

// helper for extending the store
export const extend = (nextState) => {
  if (!isObject(nextState)) {
    throw new Error('"extend" argument must be an object literal.');
  }

  store.state = nextState;
}
