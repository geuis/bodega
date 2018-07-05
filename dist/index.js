'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = exports.fastEqual = exports.extend = exports.attach = undefined;

var _store = require('./store');

var _react = require('./adapters/react');

var _fastDeepEqual = require('./util/fast-deep-equal');

exports.attach = _react.attach;
exports.extend = _store.extend;
exports.fastEqual = _fastDeepEqual.fastEqual;
exports.store = _store.store;