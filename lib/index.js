"use strict";
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
__export(require("./formutil"));
__export(require("./util"));
__export(require("./core"));
__export(require("./state"));
__export(require("./edit"));
__export(require("./route"));
__export(require("./diff"));
__export(require("./merge"));
__export(require("./update"));
__export(require("./useSearch"));
__export(require("./useMessage"));
__export(require("./useEdit"));
__export(require("./components"));
__export(require("./search"));
function checked(s, v) {
  if (s) {
    if (Array.isArray(s)) {
      return s.includes(v);
    }
    else {
      return s === v;
    }
  }
  return false;
}
exports.checked = checked;
function value(obj) {
  return (obj ? obj : {});
}
exports.value = value;
exports.Loading = function (props) {
  var loadingStyle = {
    top: '30%',
    backgroundColor: 'white',
    border: 'none',
    'WebkitBoxShadow': 'none',
    'boxShadow': 'none'
  };
  if (props.error) {
    return React.createElement('div', null, 'Error Load Module!');
  }
  else {
    return (React.createElement('div', { className: 'loader-wrapper' }, React.createElement('div', { className: 'loader-sign', style: loadingStyle }, React.createElement('div', { className: 'loader' }))));
  }
};
