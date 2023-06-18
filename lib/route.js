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
  var parsed = qs.parse(urlSearch);
  return parsed;
}
exports.buildParameters = buildParameters;
