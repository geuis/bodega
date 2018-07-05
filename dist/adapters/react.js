'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attach = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _store = require('../store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var componentId = 0;

var attach = exports.attach = function attach(AttachedComponent) {
  var mapFromStore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (mapFromStore !== null && !Array.isArray(mapFromStore)) {
    throw new Error('mapStore passed to "attach" must be an array');
  }

  return function (_React$Component) {
    _inherits(Attached, _React$Component);

    function Attached(props, context) {
      _classCallCheck(this, Attached);

      var _this = _possibleConstructorReturn(this, (Attached.__proto__ || Object.getPrototypeOf(Attached)).call(this, props, context));

      _this.id = componentId++;
      _this.state = {};
      return _this;
    }

    _createClass(Attached, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        _store.componentCache[this.id] = this.reRender.bind(this);

        if (mapFromStore && mapFromStore.length > 0) {
          _store.mapStoreCache[this.id] = mapFromStore;
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        delete _store.componentCache[this.id];
        delete _store.mapStoreCache[this.id];
      }
    }, {
      key: 'reRender',
      value: function reRender() {
        this.setState({});
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(AttachedComponent, this.props);
      }
    }]);

    return Attached;
  }(_react2.default.Component);
};