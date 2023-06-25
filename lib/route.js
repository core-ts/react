"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var qs = require("query-string");
function buildFromUrl() {
  return buildParameters(window.location.search);
}
exports.buildFromUrl = buildFromUrl;
function buildParameters(url) {
  var urlSearch = url;
  var i = urlSearch.indexOf('?');
  if (i >= 0) {
    urlSearch = url.substring(i + 1);
  }
  try {
    var parsed = convertToObject(qs.parse(urlSearch));
    return parsed;
  }
  catch (error) {
    console.log(error);
    throw error;
  }
}
exports.buildParameters = buildParameters;
function convertToObject(input) {
  var output = {};
  for (var key in input) {
    var value = input[key];
    var keys = key.split('.');
    var currentObj = output;
    for (var i = 0; i < keys.length; i++) {
      var currentKey = keys[i];
      if (!currentObj[currentKey]) {
        if (i === keys.length - 1) {
          currentObj[currentKey] = value;
        }
        else {
          currentObj[currentKey] = {};
        }
      }
      currentObj = currentObj[currentKey];
    }
  }
  return output;
}
exports.convertToObject = convertToObject;
