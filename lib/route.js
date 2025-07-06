"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
var qs = require("query-string")
var reflect_1 = require("./reflect")
function goBack(navigate, confirm, resource, o1, o2, keys, version) {
  if (!reflect_1.hasDiff(o1, o2, keys, version)) {
    navigate(-1)
  } else {
    confirm(resource.msg_confirm_back, function () {
      return navigate(-1)
    })
  }
}
exports.goBack = goBack
function buildFromUrl(modelT) {
  return buildParameters(window.location.search, modelT)
}
exports.buildFromUrl = buildFromUrl
function buildParameters(url, model) {
  var urlSearch = url
  var i = urlSearch.indexOf("?")
  if (i >= 0) {
    urlSearch = url.substring(i + 1)
  }
  try {
    var parsed = convertToObject(qs.parse(urlSearch), model)
    return parsed
  } catch (error) {
    console.log(error)
    throw error
  }
}
exports.buildParameters = buildParameters
function convertToObject(input, model) {
  if (model) {
    return parseToModel(input, model)
  }
  var output = {}
  for (var key in input) {
    var value = input[key]
    var keys = key.split(".")
    var currentObj = output
    for (var i = 0; i < keys.length; i++) {
      var currentKey = keys[i]
      if (!currentObj[currentKey]) {
        if (i === keys.length - 1) {
          currentObj[currentKey] = parseValue(value)
        } else {
          currentObj[currentKey] = {}
        }
      }
      currentObj = currentObj[currentKey]
    }
  }
  return output
}
exports.convertToObject = convertToObject
function parseToModel(dest, src) {
  if (typeof dest !== "object" || typeof src !== "object") {
    return dest
  }
  for (var key in src) {
    if (!Object.hasOwn(dest, key)) continue
    if (src.hasOwnProperty(key)) {
      if (src[key] && src[key].constructor === Object) {
        if (!dest[key] || dest[key].constructor !== Object) {
          dest[key] = {}
        }
        parseToModel(dest[key], src[key])
      } else if (src[key] instanceof Date) {
        dest[key] = new Date(dest[key])
      } else if (typeof src[key] === "boolean") {
        if (dest[key].length > 0) {
          dest[key] = new Boolean(dest[key])
        }
      } else if (typeof src[key] === "number") {
        if (typeof dest[key] === "string" && dest[key].indexOf(".") !== -1) {
          dest[key] = parseFloat(dest[key])
        } else {
          dest[key] = parseInt(dest[key], 10)
        }
      } else if (typeof src[key] === "string") {
        if (dest[key]) {
          dest[key] = dest[key].toString()
        }
      }
    }
  }
  return dest
}
function parseValue(value) {
  if (!isNaN(value) && !isNaN(parseFloat(value))) {
    return parseFloat(value)
  }
  return value
}
