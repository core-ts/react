"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
var React = require("react")
var core_1 = require("./core")
function PageSizeSelect(p) {
  var g = p.sizes
  var s = !g || g.length === 0 ? core_1.pageSizes : g
  var opts = s.map(function (pgSize) {
    return React.createElement("option", { key: pgSize, value: pgSize }, pgSize)
  })
  return React.createElement("select", { id: p.id, name: p.name, defaultValue: p.size, onChange: p.onChange }, opts)
}
exports.PageSizeSelect = PageSizeSelect
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
      p.clear && React.createElement("button", { type: "button", hidden: !p.value, className: "btn-remove-text", onClick: p.clear }),
      p.toggle && React.createElement("button", { type: "button", className: "btn-filter", onClick: p.toggle }),
      p.search && React.createElement("button", { type: "submit", className: "btn-search", onClick: p.search }),
    ),
  )
}
exports.Search = Search
