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
  return separator === "," ? "," : "."
}
exports.getDecimalSeparator = getDecimalSeparator
var r1 = / |,|\$|€|£|¥|'|٬|،| /g
var r2 = / |\.|\$|€|£|¥|'|٬|،| /g
function updateNumber(e, o, setObj, decimalSeparator, callback, formatStr) {
  var ctrl = e.target
  var v0 = formatStr ? formatStr(ctrl.value) : ctrl.value
  var dataField = ctrl.getAttribute("data-field")
  var field = dataField ? dataField : ctrl.name
  var v = decimalSeparator === "," ? v0.replace(r2, "") : v0.replace(r1, "")
  if (v.indexOf(",") >= 0) {
    v = v.replace(",", ".")
  }
  var val = isNaN(v) ? undefined : parseInt(v)
  reflect_1.setValue(o, field, val)
  setObj(__assign({}, o))
  if (callback) {
    callback()
  }
}
exports.updateNumber = updateNumber
function formatAndUpdateState(e, o, setObj, formatStr, callback) {
  updateState(e, o, setObj, callback, formatStr)
}
exports.formatAndUpdateState = formatAndUpdateState
function updateState(e, o, setObj, callback, formatStr) {
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
        var val = core_1.removePhoneFormat(v0)
        reflect_1.setValue(o, field, val)
      } else if (datatype === "fax") {
        var val = core_1.removeFaxFormat(v0)
        reflect_1.setValue(o, field, val)
      } else if (datatype === "number" || datatype === "int") {
        var decimalSeparator = getDecimalSeparator(ctrl)
        var v = decimalSeparator === "," ? v0.replace(r2, "") : v0.replace(r1, "")
        if (v.indexOf(",") >= 0) {
          v = v.replace(",", ".")
        }
        var val = isNaN(v) ? undefined : parseFloat(v)
        reflect_1.setValue(o, field, val)
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
