"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
var React = require("react")
var core_1 = require("./core")
function Error(p) {
  return React.createElement(
    "div",
    {},
    React.createElement(
      "header",
      { className: "error-header" },
      p.back && React.createElement("button", { type: "button", id: "backBtn", name: "backBtn", className: "btn-back", onClick: p.back }),
      React.createElement("h2", {}, p.title),
    ),
    React.createElement("div", { className: "error-body" }, React.createElement("h4", { className: "h4" }, p.message)),
  )
}
exports.Error = Error
function PageSizeSelect(p) {
  var g = p.sizes
  var s = !g || g.length === 0 ? core_1.pageSizes : g
  var opts = s.map(function (pgSize) {
    return React.createElement("option", { key: pgSize, value: pgSize }, pgSize)
  })
  return React.createElement("select", { id: p.id, name: p.name, className: p.className, value: p.size, onChange: p.onChange }, opts)
}
exports.PageSizeSelect = PageSizeSelect
function Select(p) {
  var s = p.items
  var opts = s.map(function (item) {
    return React.createElement("option", { key: item.value, value: item.value }, item.text)
  })
  return React.createElement("select", { id: p.id, name: p.name, className: p.className, value: p.value, onChange: p.onChange }, opts)
}
exports.Select = Select
function Search(p) {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "label",
      { className: p.className },
      p.pageSizeChanged && React.createElement(PageSizeSelect, { size: p.size, sizes: p.sizes, onChange: p.pageSizeChanged, name: p.name, id: p.id }),
      React.createElement("input", {
        type: "text",
        id: "q",
        name: "q",
        value: p.value || "",
        onChange: p.onChange,
        maxLength: p.maxLength,
        placeholder: p.placeholder,
      }),
      p.clear &&
        React.createElement("button", { type: "button", id: "clearQBtn", name: "clearQBtn", hidden: !p.value, className: "btn-remove-text", onClick: p.clear }),
      p.toggle && React.createElement("button", { type: "button", id: "toggleSearchBtn", name: "toggleSearchBtn", className: "btn-filter", onClick: p.toggle }),
      p.search && React.createElement("button", { type: "submit", id: "searchBtn", name: "searchBtn", className: "btn-search", onClick: p.search }),
    ),
  )
}
exports.Search = Search
