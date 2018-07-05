'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extend = exports.store = exports.mapStoreCache = exports.componentCache = undefined;

var _fastDeepEqual = require('./util/fast-deep-equal');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
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

var Proxy = window.Proxy || global.proxy || undefined;

if (!Proxy) {
  throw new Error('Proxy is not supported in this environment.');
}

var isObject = function isObject(value) {
  return value && value.constructor === Object;
};

var reRender = function reRender(nextState) {
  for (var componentId in componentCache) {
    // only re-render component if it has passed mapStore arguments
    if (Array.isArray(mapStoreCache[componentId]) && mapStoreCache[componentId].length > 0) {
      for (var i = mapStoreCache[componentId].length; i--;) {
        var properties = mapStoreCache[componentId][i].split('.');

        // since setters only use the top level property, simple check here
        if (properties[0] in nextState) {
          componentCache[componentId]();
        }
      }
    }
  }
};

var storeState = {};

var componentCache = exports.componentCache = {};

var mapStoreCache = exports.mapStoreCache = {};

// if property is an object or array, return a copy
var copy = function copy(value) {
  var valueIsObject = isObject(value);
  var valueIsArray = Array.isArray(value);

  if (valueIsObject) {
    var newValue = Object.assign({}, value);
    var keys = Object.keys(newValue);

    for (var i = keys.length; i--;) {
      newValue[keys[i]] = copy(newValue[keys[i]]);
    }

    return newValue;
  }

  if (valueIsArray) {
    var _newValue = [].concat(_toConsumableArray(value));

    for (var _i = _newValue.length; _i--;) {
      _newValue[_i] = copy(_newValue[_i]);
    }

    return _newValue;
  }

  if (value && value.constructor === Date) {
    return new Date(value);
  }

  return value;
};

var store = exports.store = new Proxy(storeState, {
  get: function get(target, name) {
    if (name === 'state') {
      return copy(target);
    }

    // need to memoize this so every access doesn't generate a new copy

    return copy(target[name]);
  },

  set: function set(target, name, value) {
    if (name === 'state') {
      throw new Error('The state property is protected. ' + 'Use "store.update" to update multiple properties.');
    }

    var currentState = _defineProperty({}, name, target[name]);
    var nextState = _defineProperty({}, name, value);

    if ((0, _fastDeepEqual.fastEqual)(currentState, nextState)) {
      return true;
    }

    target[name] = value;

    reRender(nextState);

    return true;
  }
});

var extend = exports.extend = function extend(nextState) {
  if (!isObject(nextState)) {
    throw new Error('"extend" argument must be an object literal.');
  }

  storeState = Object.assign(storeState, nextState);
};