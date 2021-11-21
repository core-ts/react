"use strict";
var __assign = (this && this.__assign) || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var reflectx_1 = require("reflectx");
var util_1 = require("./util");
exports.enLocale = {
  'id': 'en-US',
  'countryCode': 'US',
  'dateFormat': 'M/d/yyyy',
  'firstDayOfWeek': 1,
  'decimalSeparator': '.',
  'groupSeparator': ',',
  'decimalDigits': 2,
  'currencyCode': 'USD',
  'currencySymbol': '$',
  'currencyPattern': 0
};
function localeOf(lc, glc) {
  var l = lc;
  if (!l) {
    if (glc) {
      if (typeof glc === 'function') {
        l = glc();
      }
      else {
        l = glc;
      }
    }
    if (!l) {
      l = exports.enLocale;
    }
  }
  return l;
}
exports.localeOf = localeOf;
function handleEvent(e, removeErr) {
  var ctrl = e.currentTarget;
  var type = ctrl.getAttribute('type');
  var isPreventDefault = type && (['checkbox', 'radio'].indexOf(type.toLowerCase()) >= 0 ? false : true);
  if (isPreventDefault) {
    e.preventDefault();
  }
  if (removeErr &&
    ctrl.nodeName === 'SELECT' &&
    ctrl.value &&
    ctrl.classList.contains('invalid')) {
    removeErr(ctrl);
  }
}
exports.handleEvent = handleEvent;
function handleProps(e, props, ctrl, modelName, tloc, prepareData) {
  var _a, _b, _c, _d;
  if (props.setGlobalState) {
    var res = util_1.valueOf(ctrl, tloc, e.type);
    if (res.mustChange) {
      var dataField = ctrl.getAttribute('data-field');
      var field = (dataField ? dataField : ctrl.name);
      var propsDataForm = props[modelName];
      var form = ctrl.form;
      if (form) {
        var formName = form.name;
        if (field.indexOf('.') < 0 && field.indexOf('[') < 0) {
          var data = props.shouldBeCustomized && prepareData ? prepareData((_a = {}, _a[ctrl.name] = res.value, _a)) : (_b = {}, _b[ctrl.name] = res.value, _b);
          props.setGlobalState((_c = {}, _c[formName] = __assign(__assign({}, propsDataForm), data), _c));
        }
        else {
          reflectx_1.setValue(propsDataForm, field, ctrl.value);
          props.setGlobalState((_d = {}, _d[formName] = __assign({}, propsDataForm), _d));
        }
      }
    }
  }
}
exports.handleProps = handleProps;
function buildState(e, state, ctrl, modelName, tloc) {
  var form = ctrl.form;
  if (form) {
    if (modelName && modelName !== '') {
      var type = ctrl.getAttribute('type');
      var ex = state[modelName];
      var dataField = ctrl.getAttribute('data-field');
      var field = (dataField ? dataField : ctrl.name);
      var model = Object.assign({}, ex);
      if (type && type.toLowerCase() === 'checkbox') {
        var value = model[field];
        if (ctrl.id && ctrl.name !== ctrl.id) {
          if (!value || !Array.isArray(value)) {
            value = [];
          }
          value.includes(ctrl.value) ? value = value.filter(function (v) { return v !== ctrl.value; }) : value.push(ctrl.value);
          model[field] = value;
        }
        else {
          var v = valueOfCheckbox(ctrl);
          model[field] = v;
        }
        var objSet = {};
        objSet[modelName] = model;
        return objSet;
      }
      else if (type && type.toLowerCase() === 'radio') {
        if (field.indexOf('.') < 0 && field.indexOf('[') < 0) {
          model[field] = ctrl.value;
        }
        else {
          reflectx_1.setValue(model, field, ctrl.value);
        }
        var objSet = {};
        objSet[modelName] = model;
        return objSet;
      }
      else {
        var data = util_1.valueOf(ctrl, tloc, e.type);
        if (data.mustChange) {
          if (field.indexOf('.') < 0 && field.indexOf('[') < 0) {
            model[field] = data.value;
          }
          else {
            reflectx_1.setValue(model, field, data.value);
          }
          var objSet = {};
          objSet[modelName] = model;
          return objSet;
        }
      }
    }
    else {
      return buildFlatState(e, state, tloc);
    }
  }
  else {
    buildFlatState(e, state, tloc);
  }
}
exports.buildState = buildState;
function valueOfCheckbox(ctrl) {
  var ctrlOnValue = ctrl.getAttribute('data-on-value');
  var ctrlOffValue = ctrl.getAttribute('data-off-value');
  if (ctrlOnValue && ctrlOffValue) {
    var onValue = ctrlOnValue ? ctrlOnValue : true;
    var offValue = ctrlOffValue ? ctrlOffValue : false;
    return ctrl.checked === true ? onValue : offValue;
  }
  else {
    return ctrl.checked === true;
  }
}
exports.valueOfCheckbox = valueOfCheckbox;
function buildFlatState(e, state, l) {
  var _a;
  var ctrl = e.currentTarget;
  var stateName = ctrl.name;
  var objSet = {};
  var type = ctrl.getAttribute('type');
  if (type && type.toLowerCase() === 'checkbox') {
    if (ctrl.id && stateName === ctrl.id) {
      var v = valueOfCheckbox(ctrl);
      objSet[stateName] = v;
      return objSet;
    }
    else {
      var value = state[stateName];
      value.includes(ctrl.value) ? value = value.filter(function (v) { return v !== ctrl.value; }) : value.push(ctrl.value);
      var objSet2 = (_a = {}, _a[ctrl.name] = value, _a);
      return objSet2;
    }
  }
  else {
    var data = util_1.valueOf(ctrl, l, e.type);
    if (data.mustChange) {
      objSet[stateName] = data.value;
      return objSet;
    }
    else {
      return undefined;
    }
  }
}
exports.buildFlatState = buildFlatState;
