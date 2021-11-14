"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
exports.useMessage = function (initialState) {
  var _a = React.useState(initialState), msg = _a[0], setMessage = _a[1];
  var hideMessage = function () {
    setMessage({ alertClass: '', message: '' });
  };
  var showMessage = function (ms) {
    setMessage({ alertClass: 'alert alert-info', message: ms });
  };
  var showError = function (ms) {
    if (typeof ms === 'string') {
      setMessage({ alertClass: 'alert alert-error', message: ms });
    }
    else if (Array.isArray(ms) && ms.length > 0) {
      setMessage({ alertClass: 'alert alert-error', message: ms[0].message });
    }
    else {
      var x = JSON.stringify(ms);
      setMessage({ alertClass: 'alert alert-error', message: x });
    }
  };
  return { msg: msg, showError: showError, showMessage: showMessage, hideMessage: hideMessage };
};
