"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
var query_string_1 = require("query-string")
var reflect_1 = require("./reflect")
function onBack(e, navigate, confirm, resource, o1, o2, keys, version) {
  e.preventDefault()
  goBack(navigate, confirm, resource, o1, o2, keys, version)
}
exports.onBack = onBack
function goBack(navigate, confirm, resource, o1, o2, keys, version) {
  if (!o2) {
    navigate(-1)
  } else if (!reflect_1.hasDiff(o1, o2, keys, version)) {
    navigate(-1)
  } else {
    confirm(resource.msg_confirm_back, function () {
      return navigate(-1)
    })
  }
}
exports.goBack = goBack
function buildFromUrl(model) {
  return buildParameters(window.location.search, model)
}
exports.buildFromUrl = buildFromUrl
function buildParameters(url, model) {
  var query = url
  var index = url.indexOf("?")
  if (index >= 0) {
    query = url.substring(index + 1)
  }
  var parsed = query_string_1.default.parse(query, {
    parseNumbers: true,
    parseBooleans: true,
  })
  return convertToObject(parsed, model)
}
exports.buildParameters = buildParameters
function convertToObject(input, model) {
  if (model) {
    return mapToModel(input, model)
  }
  var output = {}
  for (var key in input) {
    if (!Object.prototype.hasOwnProperty.call(input, key)) {
      continue
    }
    var value = input[key]
    var keys = key.split(".")
    var current = output
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i]
      if (i === keys.length - 1) {
        current[k] = parseValue(value)
      } else {
        if (!current[k]) {
          current[k] = {}
        }
        current = current[k]
      }
    }
  }
  return output
}
exports.convertToObject = convertToObject
function mapToModel(input, model) {
  var result = {}
  var key
  for (key in model) {
    if (!Object.prototype.hasOwnProperty.call(model, key)) {
      continue
    }
    var modelValue = model[key]
    var inputValue = input[key]
    if (inputValue === undefined) {
      result[key] = modelValue
      continue
    }
    if (modelValue instanceof Date) {
      result[key] = new Date(inputValue)
    } else if (typeof modelValue === "number") {
      result[key] = Number(inputValue)
    } else if (typeof modelValue === "boolean") {
      result[key] = Boolean(inputValue)
    } else if (typeof modelValue === "string") {
      result[key] = String(inputValue)
    } else if (Object.prototype.toString.call(modelValue) === "[object Array]") {
      if (Object.prototype.toString.call(inputValue) === "[object Array]") {
        result[key] = inputValue
      } else {
        result[key] = [inputValue]
      }
    } else if (typeof modelValue === "object" && modelValue !== null) {
      result[key] = mapToModel(inputValue || {}, modelValue)
    } else {
      result[key] = inputValue
    }
  }
  return result
}
function parseValue(value) {
  if (typeof value !== "string") {
    return value
  }
  if (!isNaN(Number(value))) {
    return Number(value)
  }
  if (value === "true") {
    return true
  }
  if (value === "false") {
    return false
  }
  return value
}
