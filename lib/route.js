"use strict";
Object.defineProperty(exports,"__esModule",{value:true});
var qs = require("query-string");
function navigate(history, stateTo) {
  history.push(stateTo);
}
exports.navigate = navigate;
function buildFromUrl() {
  return buildParameters(window.location.search);
}
exports.buildFromUrl = buildFromUrl;
function buildParameters(url) {
  var urlSearch = url;
  var i = urlSearch.indexOf('?');
  if (i >= 0) {
    urlSearch = url.substr(i + 1);
  }
  var parsed = qs.parse(urlSearch);
  return parsed;
}
exports.buildParameters = buildParameters;
