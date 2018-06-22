'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Proxy = window.Proxy || undefined;

if (!Proxy) {
  throw new Error('Proxy is not supported in this environment.');
}

var isObject = function isObject(value) {
  return value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.constructor === Object;
};

var reRender = function reRender() {
  for (var key in componentCache) {
    componentCache[key]();
  }
};

var componentCache = exports.componentCache = {};

var store = exports.store = new Proxy({}, {
  get: function get(target, name) {
    if (name === 'state') {
      return target;
    }

    return target[name];
  },

  set: function set(target, name, value) {
    if (name === 'state') {
      throw new Error('The state property is protected. ' + 'Use "store.update" to update multiple properties.');
    }

    if (name === 'update') {
      if (isObject(value)) {
        target = Object.assign(target, value);
        reRender();
      } else {
        throw new Error('Update value must be an object literal');
      }

      return true;
    }

    // should always replace if primitives differ, or if objects or arrays
    // are being updated
    if (target[name] !== value) {
      target[name] = value;
      reRender();
    }

    return true;
  }
});