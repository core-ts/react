"use strict";
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
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
__export(require("./reflect"));
__export(require("./com"));
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
exports.NumberInput = function (props) {
  var _a;
  var _b = react_1.useState(undefined), state = _b[0], setState = _b[1];
  react_1.useEffect(function () {
    setState(props.value);
  }, [props.value]);
  var onChange = function (e) {
    var v1 = e.target.value;
    setState(v1);
    if (props.onChange) {
      props.onChange(e);
    }
    if (props.onChangeNumber) {
      props.onChangeNumber(parseFloat(v1));
    }
  };
  var ip = (_a = {
    value: state,
    className: props === null || props === void 0 ? void 0 : props.className,
    name: props === null || props === void 0 ? void 0 : props.name,
    onChange: onChange,
    disabled: props === null || props === void 0 ? void 0 : props.disabled
  },
    _a['data-field'] = props['data-field'],
    _a.min = props === null || props === void 0 ? void 0 : props.min,
    _a.max = props === null || props === void 0 ? void 0 : props.max,
    _a.type = props === null || props === void 0 ? void 0 : props.type,
    _a.onBlur = function (e) {
      if (props.allowZero && e.target.value === '0') {
        setState('0');
        return;
      }
      if (props.locale && props.currencyOnBlur) {
        props.currencyOnBlur(e, props.locale, props.currencyCode, props.symbol);
      }
      setTimeout(function () {
        var v2 = e.target.value;
        setState(v2);
      }, 50);
    },
    _a);
  return React.createElement("input", { className: ip.className, type: ip.type, name: ip.name, onChange: ip.onChange, disabled: ip.disabled, "data-field": ip['data-field'], min: ip.min, max: ip.max, value: state });
};
function formatDate(date, format) {
  if (!date) {
    return '';
  }
  var opts = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };
  var d2 = new Date(date).toLocaleString("en-US", opts);
  var od = format.replace("YYYY", d2.slice(6, 10));
  od = od.replace("MM", d2.slice(0, 2));
  od = od.replace("DD", d2.slice(3, 5));
  od = od.replace("HH", d2.slice(12, 14));
  od = od.replace("mm", d2.slice(15, 17));
  od = od.replace("ss", d2.slice(18, 20));
  return od;
}
exports.formatDate = formatDate;
;
function dateToString(date) {
  var d2 = typeof date !== "string" ? date : new Date(date);
  var year = d2.getFullYear();
  var month = String(d2.getMonth() + 1).padStart(2, "0");
  var day = String(d2.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}
exports.dateToString = dateToString;
;
function datetimeToString(date) {
  if (date === void 0) { date = ""; }
  var d2 = typeof date !== "string" ? date : new Date(date);
  var year = d2.getFullYear();
  var month = String(d2.getMonth() + 1).padStart(2, "0");
  var day = String(d2.getDate()).padStart(2, "0");
  var hours = String(d2.getHours()).padStart(2, "0");
  var minutes = String(d2.getMinutes()).padStart(2, "0");
  var seconds = String(d2.getSeconds()).padStart(2, "0");
  return year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;
}
exports.datetimeToString = datetimeToString;
;
