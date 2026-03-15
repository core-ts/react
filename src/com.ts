import * as React from "react"
import { Locale, pageSizes } from "./core"

export interface ErrorProps {
  title?: string
  message?: string
  back?: React.MouseEventHandler<HTMLElement>
}
export function Error(p: ErrorProps) {
  return React.createElement(
    "div",
    {},
    React.createElement(
      "header",
      {},
      p.back && React.createElement("button", { type: "button", id: "btnBack", name: "btnBack", className: "btn-back", onClick: p.back }),
      React.createElement("h2", {}, p.title),
    ),
    React.createElement("div", { className: "error-body" }, React.createElement("h4", { className: "h4" }, p.message)),
  )
  /*
  <div>
    <header>
      <button type="button" id="btnBack" name="btnBack" className="btn-back" onClick={() => navigate(-1)}></button>
      <h2>{resource.error_404_title}</h2>
    </header>
    <div className="error-body">
      <h4 className="h4">{resource.error_404_message}</h4>
    </div>
  </div>
  */
}
export interface PageSizeProps {
  id?: string
  name?: string
  size?: number
  sizes?: number[]
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}
export function PageSizeSelect(p: PageSizeProps) {
  const g = p.sizes
  const s = !g || g.length === 0 ? pageSizes : g
  const opts = s.map((pgSize) => React.createElement("option", { key: pgSize, value: pgSize }, pgSize))
  return React.createElement("select", { id: p.id, name: p.name, defaultValue: p.size, onChange: p.onChange }, opts)
}
export interface Props {
  id?: string
  name?: string
  size?: number
  sizes?: number[]
  className?: string
  maxLength?: number
  value?: string
  placeholder?: string
  pageSizeChanged?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  search?: React.MouseEventHandler<HTMLElement>
  toggle?: React.MouseEventHandler<HTMLElement>
  clear?: React.MouseEventHandler<HTMLButtonElement>
  onChange?: (e: any, callback?: (() => void) | undefined, lc?: Locale | undefined) => void
}
export function Search(p: Props) {
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
        React.createElement("button", { type: "button", id: "btnClearQ", name: "btnClearQ", hidden: !p.value, className: "btn-remove-text", onClick: p.clear }),
      p.toggle && React.createElement("button", { type: "button", id: "btnToggleSearch", name: "btnToggleSearch", className: "btn-filter", onClick: p.toggle }),
      p.search && React.createElement("button", { type: "submit", id: "btnSearch", name: "btnSearch", className: "btn-search", onClick: p.search }),
    ),
  )
  /*
  return (
    <>
      <label className={p.className}>
        {p.pageSizeChanged && <PageSizeSelect size={p.size} sizes={p.sizes} onChange={p.pageSizeChanged} name={p.name} id={p.id} />}
        <input type='text' id='q' name='q' value={p.value || ''} onChange={p.onChange} maxLength={p.maxLength} placeholder={p.placeholder} />
        {p.clear && <button type='button' id='btnClearQ' name='btnClearQ' hidden={!p.value} className='btn-remove-text' onClick={p.clear}/>}
        {p.toggle && <button type='button' id='btnToggleSearch' name='btnToggleSearch' className='btn-filter' onClick={p.toggle} />}
        {p.search && <button type='submit' id='btnSearch' name='btnSearch' className='btn-search' onClick={p.search} />}
      </label>
    </>
  );
  */
}
