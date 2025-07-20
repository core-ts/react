"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
function messageByHttpStatus(status, resource) {
  var k = "error_" + status
  var msg = resource[k]
  if (!msg || msg.length === 0) {
    msg = resource.error_500
  }
  return msg
}
exports.messageByHttpStatus = messageByHttpStatus
function error(err, resource, ae) {
  var title = resource.error
  var msg = resource.error_internal
  if (!err) {
    ae(msg, undefined, title)
    return
  }
  var data = err && err.response ? err.response : err
  if (data) {
    var status_1 = data.status
    if (status_1 && !isNaN(status_1)) {
      msg = messageByHttpStatus(status_1, resource)
    }
    ae(msg, undefined, title)
  } else {
    ae(msg, undefined, title)
  }
}
exports.error = error
function showLoading(loading) {
  if (loading) {
    if (typeof loading === "function") {
      loading()
    } else {
      loading.showLoading()
    }
  }
}
exports.showLoading = showLoading
function hideLoading(loading) {
  if (loading) {
    if (typeof loading === "function") {
      loading()
    } else {
      loading.hideLoading()
    }
  }
}
exports.hideLoading = hideLoading
function initForm(form, initMat) {
  if (form) {
    setTimeout(function () {
      if (initMat) {
        initMat(form)
      }
      focusFirstElement(form)
    }, 100)
  }
  return form
}
exports.initForm = initForm
function focusFirstElement(form) {
  var i = 0
  var len = form.length
  for (i = 0; i < len; i++) {
    var ctrl = form[i]
    if (!(ctrl.readOnly || ctrl.disabled)) {
      var nodeName = ctrl.nodeName
      var type = ctrl.getAttribute("type")
      if (type) {
        var t = type.toUpperCase()
        if (t === "BUTTON" || t === "SUBMIT") {
          ctrl.focus()
        }
        if (nodeName === "INPUT") {
          nodeName = t
        }
      }
      if (nodeName !== "BUTTON" && nodeName !== "RESET" && nodeName !== "SUBMIT" && nodeName !== "CHECKBOX" && nodeName !== "RADIO") {
        ctrl.focus()
        return
      }
    }
  }
}
exports.focusFirstElement = focusFirstElement
