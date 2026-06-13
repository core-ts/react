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
var core_1 = require("./core")
var reflect_1 = require("./reflect")
function getDecimalSeparator(ele) {
  var separator = ele.getAttribute("data-decimal-separator")
  if (!separator) {
    var form = ele.form
    if (form) {
      separator = form.getAttribute("data-decimal-separator")
    }
  }
  return separator === "," || separator === "٫" ? separator : "."
}
exports.getDecimalSeparator = getDecimalSeparator
function normalizeInteger(s) {
  if (!s) {
    return ""
  }
  var buf = []
  var idx = 0
  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i)
    if (c >= 48 && c <= 57) {
      buf[idx++] = s[i]
    }
  }
  return buf.join("")
}
exports.normalizeInteger = normalizeInteger
function removeSeparators(s) {
  if (!s) {
    return ""
  }
  var result = ""
  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i)
    if ((c >= 48 && c <= 57) || c === 46) {
      result += s[i]
    }
  }
  return result
}
exports.removeSeparators = removeSeparators
function normalizeNumber(input) {
  if (!input) {
    return ""
  }
  var len = input.length
  var result = ""
  for (var i = 0; i < len; i++) {
    var c = input.charCodeAt(i)
    if (c >= 48 && c <= 57) {
      result += input[i]
    } else if (c === 44 || c === 1643) {
      result += "."
    }
  }
  return result
}
exports.normalizeNumber = normalizeNumber
function updateNumber(e, o, setObj, decimalSeparator, callback, formatStr) {
  var ctrl = e.target
  var v0 = formatStr ? formatStr(ctrl.value) : ctrl.value
  var dataField = ctrl.getAttribute("data-field")
  var field = dataField ? dataField : ctrl.name
  var v = decimalSeparator === "," || decimalSeparator === "٫" ? normalizeNumber(v0) : removeSeparators(v0)
  if (v === "" || v == null) {
    reflect_1.setValue(o, field, undefined)
  } else {
    var val = isNaN(v) ? undefined : parseFloat(v)
    reflect_1.setValue(o, field, val)
  }
  setObj(__assign({}, o))
  if (callback) {
    callback()
  }
}
exports.updateNumber = updateNumber
function formatAndUpdateState(e, o, setObj, formatStr, decimalSeparator, callback) {
  updateState(e, o, setObj, decimalSeparator, formatStr, callback)
}
exports.formatAndUpdateState = formatAndUpdateState
function updateStateAndCallback(e, o, setObj, callback, decimalSeparator, formatStr) {
  updateState(e, o, setObj, decimalSeparator, formatStr, callback)
}
exports.updateStateAndCallback = updateStateAndCallback
function updateState(e, o, setObj, decimalSeparator, formatStr, callback) {
  var ctrl = e.target
  var v0 = formatStr ? formatStr(ctrl.value) : ctrl.value
  var dataField = ctrl.getAttribute("data-field")
  var field = dataField ? dataField : ctrl.name
  if (ctrl.tagName === "SELECT") {
    if (ctrl.tagName === "SELECT") {
      if (v0 === "" || !v0) {
        ctrl.removeAttribute("data-value")
      } else {
        ctrl.setAttribute("data-value", v0)
      }
    }
    reflect_1.setValue(o, field, v0)
  } else {
    var stype = ctrl.getAttribute("type")
    var type = stype ? stype.toLowerCase() : "text"
    var model = o
    if (type === "checkbox") {
      var value = model[field]
      if (ctrl.id && ctrl.name !== ctrl.id) {
        if (!value || !Array.isArray(value)) {
          value = []
        }
        value.includes(v0)
          ? (value = value.filter(function (v) {
              return v !== v0
            }))
          : value.push(v0)
        model[field] = value
      } else {
        var v = valueOfCheckbox(ctrl)
        model[field] = v
      }
    } else if (type === "radio") {
      if (field.indexOf(".") < 0 && field.indexOf("[") < 0) {
        model[field] = v0
      } else {
        reflect_1.setValue(model, field, v0)
      }
    } else if (type === "date" || type === "datetime-local") {
      var date = new Date(v0)
      var val = !isNaN(date.getTime()) ? date.toISOString() : null
      reflect_1.setValue(model, field, val)
    } else if (type === "time") {
      var date = new Date(v0)
      if (!isNaN(date.getTime())) {
        reflect_1.setValue(model, field, date.getTime())
      } else {
        reflect_1.setValue(model, field, null)
      }
    } else {
      var datatype = ctrl.getAttribute("data-type")
      if (datatype === "phone") {
        var val = core_1.normalizePhone(v0)
        reflect_1.setValue(o, field, val)
      } else if (datatype === "fax") {
        var val = core_1.normalizeFax(v0)
        reflect_1.setValue(o, field, val)
      } else if (datatype === "integer") {
        var v = normalizeInteger(v0)
        if (v === "" || v == null) {
          reflect_1.setValue(o, field, undefined)
        } else {
          var val = isNaN(v) ? undefined : parseFloat(v)
          reflect_1.setValue(o, field, val)
        }
      } else if (datatype === "number") {
        var sep = decimalSeparator ? decimalSeparator : getDecimalSeparator(ctrl)
        var v = sep === "," || sep === "٫" ? normalizeNumber(v0) : removeSeparators(v0)
        if (v === "" || v == null) {
          reflect_1.setValue(o, field, undefined)
        } else {
          var val = isNaN(v) ? undefined : parseFloat(v)
          reflect_1.setValue(o, field, val)
        }
      } else {
        reflect_1.setValue(o, field, v0)
      }
    }
  }
  setObj(__assign({}, o))
  if (callback) {
    callback()
  }
}
exports.updateState = updateState
function valueOfCheckbox(ctrl) {
  var ctrlOnValue = ctrl.getAttribute("data-on-value")
  var ctrlOffValue = ctrl.getAttribute("data-off-value")
  if (ctrlOnValue && ctrlOffValue) {
    var onValue = ctrlOnValue ? ctrlOnValue : true
    var offValue = ctrlOffValue ? ctrlOffValue : false
    return ctrl.checked === true ? onValue : offValue
  } else {
    return ctrl.checked === true
  }
}
exports.valueOfCheckbox = valueOfCheckbox
