"use strict";
Object.defineProperty(exports,"__esModule",{value:true});
var ui_plus_1 = require("ui-plus");
var uione_1 = require("uione");
var Type;
(function (Type) {
  Type["ObjectId"] = "ObjectId";
  Type["Date"] = "date";
  Type["Boolean"] = "boolean";
  Type["Number"] = "number";
  Type["Integer"] = "integer";
  Type["String"] = "string";
  Type["Text"] = "text";
  Type["Object"] = "object";
  Type["Array"] = "array";
  Type["Primitives"] = "primitives";
  Type["Binary"] = "binary";
})(Type = exports.Type || (exports.Type = {}));
function buildKeys(m) {
  var ks = Object.keys(m.attributes);
  var ps = [];
  for (var _i = 0, ks_1 = ks; _i < ks_1.length; _i++) {
    var k = ks_1[_i];
    var attr = m.attributes[k];
    if (attr.key === true) {
      ps.push(k);
    }
  }
  return ps;
}
exports.buildKeys = buildKeys;
function buildId(keys, props) {
  if (!keys || keys.length === 0 || !props) {
    return null;
  }
  var sp = (props.match ? props : props['props']);
  if (keys.length === 1) {
    var x = sp.match.params[keys[0]];
    if (x && x !== '') {
      return x;
    }
    return sp.match.params['id'];
  }
  var id = {};
  for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
    var key = keys_1[_i];
    var v = sp.match.params[key];
    if (!v) {
      v = sp[key];
      if (!v) {
        return null;
      }
    }
    id[key] = v;
  }
  return id;
}
exports.buildId = buildId;
function dateToDefaultString(date) {
  return '' + date.getFullYear() + '-' + addZero(date.getMonth() + 1, 2) + '-' + addZero(date.getDate(), 2);
}
exports.dateToDefaultString = dateToDefaultString;
function addZero(val, num) {
  var v = val.toString();
  while (v.length < num) {
    v = '0' + v;
  }
  return v.toString();
}
function formatFax(value) {
  return ui_plus_1.formatter.formatFax(value);
}
exports.formatFax = formatFax;
function formatPhone(value) {
  return ui_plus_1.formatter.formatPhone(value);
}
exports.formatPhone = formatPhone;
function formatNumber(num, scale, locale) {
  if (!scale) {
    scale = 2;
  }
  if (!locale) {
    locale = uione_1.storage.getLocale();
  }
  var c;
  if (!num) {
    return '';
  }
  else if (typeof num === 'number') {
    c = num;
  }
  else {
    var x = num;
    if (isNaN(x)) {
      return '';
    }
    else {
      c = parseFloat(x);
    }
  }
  return uione_1.storage.locale().formatNumber(c, scale, locale);
}
exports.formatNumber = formatNumber;
function formatCurrency(currency, locale, currencyCode) {
  if (!currencyCode) {
    currencyCode = 'USD';
  }
  if (!locale) {
    locale = uione_1.storage.getLocale();
  }
  var c;
  if (!currency) {
    return '';
  }
  else if (typeof currency === 'number') {
    c = currency;
  }
  else {
    var x = currency;
    x = x.replace(locale.decimalSeparator, '.');
    if (isNaN(x)) {
      return '';
    }
    else {
      c = parseFloat(x);
    }
  }
  return uione_1.storage.locale().formatCurrency(c, currencyCode, locale);
}
exports.formatCurrency = formatCurrency;
