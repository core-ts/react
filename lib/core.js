"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.pageSizes = [12, 24, 60, 100, 120, 180, 300, 600]
exports.sizes = exports.pageSizes
var resources = (function () {
  function resources() {}
  resources.getSortId = function (field) {
    return field + "Sort"
  }
  resources.normalizePhone = function (s) {
    if (!s) {
      return ""
    }
    var len = s.length
    var buf = new Array(len)
    var j = 0
    for (var i = 0; i < len; i++) {
      var c = s.charCodeAt(i)
      if (c === 43 || (c >= 48 && c <= 57)) {
        buf[j++] = s[i]
      }
    }
    return j === len ? buf.join("") : buf.slice(0, j).join("")
  }
  resources.normalizeFax = function (fax) {
    return resources.normalizePhone(fax)
  }
  resources._cache = {}
  resources.cache = true
  resources.fields = "fields"
  resources.page = "page"
  resources.limit = "limit"
  resources.defaultLimit = 24
  resources.limits = exports.pageSizes
  resources.pageMaxSize = 7
  return resources
})()
exports.resources = resources
function normalizePhone(phone) {
  return resources.normalizePhone(phone)
}
exports.normalizePhone = normalizePhone
function normalizeFax(fax) {
  return resources.normalizeFax(fax)
}
exports.normalizeFax = normalizeFax
