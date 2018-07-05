
// Proxy
// getter/setter only detects top level property
//   - setting sub property doesn't trigger setter
// modifying arrays directly doesn't trigger setter

// initially load properties via store.update = {} for each section of state
// set store property 
//   - if top level property (primitive, object, array) set directly
//   - if array, clone array and modify, then set top level prop
//   - if object, clone object and modify, then set top level prop
// component should pass array of strings representing props to get from store
//   - strings should be property names, can use dot notation
// 

import {fastEqual} from './util/fast-deep-equal';

const Proxy = window.Proxy || global.proxy || undefined;

if (!Proxy) {
  throw new Error('Proxy is not supported in this environment.');
}

const isObject = (value) => value && value.constructor === Object;

const reRender = (nextState) => {
  for (const componentId in componentCache) {
    // only re-render component if it has passed mapStore arguments
    if (
      Array.isArray(mapStoreCache[componentId]) &&
      mapStoreCache[componentId].length > 0
    ) {
      for (let i = mapStoreCache[componentId].length; i--;) {
        const properties = mapStoreCache[componentId][i].split('.');

        // since setters only use the top level property, simple check here
        if (properties[0] in nextState) {
          componentCache[componentId]();
        }
      }
    }
  }
};

let storeState = {};

export const componentCache = {};

export const mapStoreCache = {};

// if property is an object or array, return a copy
const copy = (value) => {
  const valueIsObject = isObject(value);
  const valueIsArray = Array.isArray(value);

  if (valueIsObject) {
    const newValue = Object.assign({}, value);
    const keys = Object.keys(newValue);

    for (let i = keys.length; i--;) {
      newValue[keys[i]] = copy(newValue[keys[i]]);
    }

    return newValue;
  }

  if (valueIsArray) {
    const newValue = [...value];

    for (let i = newValue.length; i--;) {
      newValue[i] = copy(newValue[i])
    }

    return newValue;
  }

  if (value && value.constructor === Date) {
    return new Date(value);
  }

  return value;
}

export const store = new Proxy(storeState, {
  get: (target, name) => {
    if (name === 'state') {
      return copy(target);
    }

    // need to memoize this so every access doesn't generate a new copy

    return copy(target[name]);
  },

  set: (target, name, value) => {
    if (name === 'state') {
      throw new Error(
        'The state property is protected. ' +
        'Use "store.update" to update multiple properties.'
      );
    }

    const currentState = {
      [name]: target[name]
    };
    const nextState = {
      [name]: value
    };

    if (fastEqual(currentState, nextState)) {
      return true;
    }

    target[name] = value;

    reRender(nextState);

    return true;
  }
});

export const extend = (nextState) => {
  if (!isObject(nextState)) {
    throw new Error('"extend" argument must be an object literal.');
  }

  storeState = Object.assign(storeState, nextState);
}
