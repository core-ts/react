"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.pageSizes = [12, 24, 60, 100, 120, 180, 300, 600]
exports.sizes = exports.pageSizes
var resources = (function () {
  function resources() {}
  resources.removePhoneFormat = function (phone) {
    return phone ? phone.replace(resources.phone, "") : ""
  }
  resources.removeFaxFormat = function (fax) {
    return fax ? fax.replace(resources.fax, "") : ""
  }
  resources._cache = {}
  resources.cache = true
  resources.fields = "fields"
  resources.page = "page"
  resources.limit = "limit"
  resources.defaultLimit = 24
  resources.limits = exports.pageSizes
  resources.pageMaxSize = 7
  resources.phone = / |\-|\.|\(|\)/g
  resources.fax = / |\-|\.|\(|\)/g
  return resources
})()
exports.resources = resources
function removePhoneFormat(phone) {
  return resources.removePhoneFormat(phone)
}
exports.removePhoneFormat = removePhoneFormat
function removeFaxFormat(fax) {
  return resources.removeFaxFormat(fax)
}
exports.removeFaxFormat = removeFaxFormat
