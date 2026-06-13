"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.pageSizes = [12, 24, 60, 100, 120, 180, 300, 600]
exports.sizes = exports.pageSizes
var resources = (function () {
  function resources() {}
  resources.getSortId = function (field) {
    return field + "Sort"
  }
  resources.normalizePhone = function (phone) {
    return phone ? phone.replace(/[^+\d]/g, "") : ""
  }
  resources.normalizeFax = function (fax) {
    return fax ? fax.replace(/[^+\d]/g, "") : ""
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
