"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("./core");
var merge_1 = require("./merge");
var state_1 = require("./state");
exports.useBase = function (initialState, getLocale, removeErr, getName) {
  var _a = merge_1.useMergeState(initialState), state = _a[0], setState = _a[1];
  var updatePhoneState = function (event) {
    var re = /^[0-9\b]+$/;
    var target = event.currentTarget;
    var value = core_1.removePhoneFormat(target.value);
    if (re.test(value) || !value) {
      updateState(event);
    }
    else {
      var splitArr = value.split('');
      var responseStr_1 = '';
      splitArr.forEach(function (element) {
        if (re.test(element)) {
          responseStr_1 += element;
        }
      });
      target.value = responseStr_1;
      updateState(event);
    }
  };
  var _getModelName = function (f) {
    var f2 = f;
    if (!f2) {
      f2 = _this.form;
    }
    if (f2) {
      var a = core_1.getModelName(f2);
      if (a && a.length > 0) {
        return a;
      }
    }
    return 'model';
  };
  var getModelName = getName ? getName : _getModelName;
  var updateState = function (e, callback, lc) {
    var ctrl = e.currentTarget;
    var modelName = getModelName(ctrl.form);
    var l = state_1.localeOf(lc, getLocale);
    state_1.handleEvent(e, removeErr);
    var objSet = state_1.buildState(e, state, ctrl, modelName, l);
    if (objSet) {
      if (callback) {
        setState(objSet, callback);
      }
      else {
        setState(objSet);
      }
    }
  };
  var updateFlatState = function (e, callback, lc) {
    var l = state_1.localeOf(lc, _this.getLocale);
    var objSet = state_1.buildFlatState(e, state, l);
    if (objSet) {
      if (callback) {
        setState(objSet, callback);
      }
      else {
        setState(objSet);
      }
    }
  };
  return {
    getModelName: getModelName,
    updateState: updateState,
    updatePhoneState: updatePhoneState,
    updateFlatState: updateFlatState,
    getLocale: getLocale,
    setState: setState,
    state: state
  };
};
function prepareData(data) {
}
exports.useBaseProps = function (props, initialState, gl, removeErr, getName, prepareCustomData) {
  if (!prepareCustomData) {
    prepareCustomData = prepareData;
  }
  var baseProps = exports.useBase(initialState, gl, removeErr, getName);
  var getModelName = baseProps.getModelName, updatePhoneState = baseProps.updatePhoneState, updateFlatState = baseProps.updateFlatState, getLocale = baseProps.getLocale, state = baseProps.state, setState = baseProps.setState;
  var updateState = function (e, callback, lc) {
    var ctrl = e.currentTarget;
    var modelName = getModelName(ctrl.form);
    var l = state_1.localeOf(lc, gl);
    state_1.handleEvent(e, removeErr);
    if (props.setGlobalState) {
      state_1.handleProps(e, props, ctrl, modelName, l, prepareCustomData);
    }
    else {
      var objSet = state_1.buildState(e, state, ctrl, modelName, l);
      if (objSet) {
        if (callback) {
          setState(objSet, callback);
        }
        else {
          setState(objSet);
        }
      }
    }
  };
  return {
    getModelName: getModelName,
    updateState: updateState,
    updatePhoneState: updatePhoneState,
    updateFlatState: updateFlatState,
    getLocale: getLocale,
    setState: setState,
    state: state
  };
};
