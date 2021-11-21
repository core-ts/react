"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("./core");
var merge_1 = require("./merge");
var state_1 = require("./state");
var m = 'model';
var _getModelName = function (f2) {
  return core_1.getModelName(f2, m);
};
exports.useUpdate = function (initialState, getName, getLocale, removeErr) {
  return exports.useUpdateWithProps(undefined, initialState, getName, getLocale, removeErr);
};
function prepareData(data) {
}
exports.useUpdateWithProps = function (props, initialState, getName, getLocale, removeErr, prepareCustomData) {
  if (!prepareCustomData) {
    prepareCustomData = prepareData;
  }
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
  var getModelName = (typeof getName === 'function' ? getName : _getModelName);
  var updateState = function (e, callback, lc) {
    var ctrl = e.currentTarget;
    var mn = m;
    if (getName) {
      if (typeof getName === 'string') {
        mn = getName;
      }
      else {
        mn = getName(ctrl.form);
      }
    }
    else {
      mn = _getModelName(ctrl.form);
    }
    var l = state_1.localeOf(lc, getLocale);
    state_1.handleEvent(e, removeErr);
    if (props && props.setGlobalState) {
      state_1.handleProps(e, props, ctrl, mn, l, prepareCustomData);
    }
    else {
      var objSet = state_1.buildState(e, state, ctrl, mn, l);
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
  var updateFlatState = function (e, callback, lc) {
    var objSet = state_1.buildFlatState(e, state, lc);
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
