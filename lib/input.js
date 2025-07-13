"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
function getResource(p) {
  var x = p
  if (x.value && x.format && typeof x.value === "function") {
    return x
  } else {
    return x.resource
  }
}
exports.getResource = getResource
function getAutoSearch(p) {
  var x = p
  if (x.value && x.format && typeof x.value === "function") {
    return true
  }
  return x.auto
}
exports.getAutoSearch = getAutoSearch
function getUIService(p, ui0) {
  if (ui0) {
    return ui0
  }
  return p.ui
}
exports.getUIService = getUIService
function getLoadingFunc(p, ui0) {
  if (ui0) {
    return ui0
  }
  return p.loading
}
exports.getLoadingFunc = getLoadingFunc
function getMsgFunc(p, showMsg) {
  if (showMsg) {
    return showMsg
  }
  return p.showMessage
}
exports.getMsgFunc = getMsgFunc
function getConfirmFunc(p, cf) {
  if (cf) {
    return cf
  }
  return p.confirm
}
exports.getConfirmFunc = getConfirmFunc
function getLocaleFunc(p, getLoc) {
  if (getLoc) {
    return getLoc
  }
  return p.getLocale
}
exports.getLocaleFunc = getLocaleFunc
function getErrorFunc(p, showErr) {
  if (showErr) {
    return showErr
  }
  return p.showError
}
exports.getErrorFunc = getErrorFunc
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
