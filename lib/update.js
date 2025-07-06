"use strict"
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i]
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
        }
        return t
      }
    return __assign.apply(this, arguments)
  }
Object.defineProperty(exports, "__esModule", { value: true })
var react_1 = require("react")
var core_1 = require("./core")
var merge_1 = require("./merge")
var state_1 = require("./state")
function removePhoneFormat(phone) {
  if (phone) {
    return phone.replace(core_1.resources.phone, "")
  } else {
    return phone
  }
}
exports.removePhoneFormat = removePhoneFormat
function getModelName(form, name) {
  if (form) {
    var a = form.getAttribute("model-name")
    if (a && a.length > 0) {
      return a
    }
    var b = form.name
    if (b) {
      if (b.endsWith("Form")) {
        return b.substring(0, b.length - 4)
      }
      return b
    }
  }
  if (name && name.length > 0) {
    return name
  }
  return ""
}
exports.getModelName = getModelName
var m = "model"
var _getModelName = function (f2) {
  return getModelName(f2, m)
}
exports.useUpdate = function (initialState, getName, getLocale, removeErr) {
  var _a = merge_1.useMergeState(initialState),
    state = _a[0],
    setState = _a[1]
  var _b = react_1.useState(false),
    rerender = _b[0],
    setRerender = _b[1]
  react_1.useEffect(
    function () {
      setRerender(!rerender)
    },
    [state],
  )
  var updatePhoneState = function (event) {
    var re = /^[0-9\b]+$/
    var target = event.currentTarget
    var value = removePhoneFormat(target.value)
    if (re.test(value) || !value) {
      updateState(event)
    } else {
      var splitArr = value.split("")
      var responseStr_1 = ""
      splitArr.forEach(function (element) {
        if (re.test(element)) {
          responseStr_1 += element
        }
      })
      target.value = responseStr_1
      updateState(event)
    }
  }
  var getModelName = typeof getName === "function" ? getName : _getModelName
  var updateState = function (e, callback, lc) {
    var ctrl = e.currentTarget
    var mn = m
    if (getName) {
      if (typeof getName === "string") {
        mn = getName
      } else {
        mn = getName(ctrl.form)
      }
    } else {
      mn = _getModelName(ctrl.form)
    }
    var l = state_1.localeOf(lc, getLocale)
    state_1.handleEvent(e, removeErr)
    var objSet = state_1.buildState(e, state, ctrl, mn, l)
    if (objSet) {
      if (callback) {
        setState(__assign({}, objSet), callback)
      } else {
        setState(objSet)
      }
    }
  }
  var updateFlatState = function (e, callback, lc) {
    var objSet = state_1.buildFlatState(e, state, lc)
    if (objSet) {
      if (callback) {
        setState(objSet, callback)
      } else {
        setState(objSet)
      }
    }
  }
  return {
    getModelName: getModelName,
    updateState: updateState,
    updatePhoneState: updatePhoneState,
    updateFlatState: updateFlatState,
    getLocale: getLocale,
    setState: setState,
    state: state,
  }
}
