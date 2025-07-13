"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.pageSizes = [12, 24, 60, 100, 120, 180, 300, 600]
exports.sizes = exports.pageSizes
var resources = (function () {
  function resources() {}
  resources.phone = / |\-|\.|\(|\)/g
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
