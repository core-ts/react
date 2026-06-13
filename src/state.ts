import { ChangeEvent } from "react"
import { normalizeFax, normalizePhone } from "./core"
import { setValue } from "./reflect"

export function getDecimalSeparator(ele: HTMLInputElement): string {
  let separator = ele.getAttribute("data-decimal-separator")
  if (!separator) {
    const form = ele.form
    if (form) {
      separator = form.getAttribute("data-decimal-separator")
    }
  }
  return separator === "," || separator === "٫" ? separator : "."
}
export function normalizeInteger(s?: string | null): string {
  if (!s) {
    return ""
  }
  const len = s.length
  const buf = new Array<string>(len)
  let j = 0
  for (let i = 0; i < len; i++) {
    const c = s.charCodeAt(i)
    if (c >= 48 && c <= 57) {
      buf[j++] = s[i]
    }
  }
  return j === len ? buf.join("") : buf.slice(0, j).join("")
}
export function removeSeparators(s?: string | null): string {
  if (!s) {
    return ""
  }
  const len = s.length
  const buffer = new Uint16Array(len) // preallocate max possible
  let write = 0

  for (let i = 0; i < len; i++) {
    const c = s.charCodeAt(i)
    // '0'–'9' (48–57), '.' (46)
    if ((c >= 48 && c <= 57) || c === 46) {
      buffer[write++] = c
    }
  }
  // Convert only the used portion to string
  return String.fromCharCode.apply(null, buffer.subarray(0, write) as any)
}
// Keep digits 0–9 ; Replace , and ٫ (Arabic decimal separator) → . ; Remove everything else
export function normalizeNumber(s?: string | null): string {
  if (!s) {
    return ""
  }
  const len = s.length
  const buf = new Array<string>(len)
  let j = 0
  for (let i = 0; i < len; i++) {
    const c = s.charCodeAt(i)

    if (c >= 48 && c <= 57) {
      buf[j++] = s[i]
    } else if (c === 44 || c === 1643) {
      buf[j++] = "."
    }
  }
  return j === len ? buf.join("") : buf.slice(0, j).join("")
}
// const r1 = / |,|\$|€|£|¥|'|٬|،| /g
// const r2 = / |\.|\$|€|£|¥|'|٬|،| /g
export function updateNumber<T>(
  e: ChangeEvent<HTMLInputElement>,
  o: T,
  setObj: (v: React.SetStateAction<T>) => void,
  decimalSeparator?: string,
  callback?: () => void,
  formatStr?: (s?: string) => string,
) {
  const ctrl = e.target
  const v0: string = formatStr ? formatStr(ctrl.value) : ctrl.value
  const dataField = ctrl.getAttribute("data-field")
  const field = dataField ? dataField : ctrl.name
  let v = decimalSeparator === "," || decimalSeparator === "٫" ? normalizeNumber(v0) : removeSeparators(v0)
  if (v === "" || v == null) {
    setValue(o, field, undefined)
  } else {
    const val = isNaN(v as any) ? undefined : parseFloat(v)
    setValue(o, field, val)
  }
  setObj({ ...o })
  if (callback) {
    callback()
  }
}
export function formatAndUpdateState<T>(
  e:
    | ChangeEvent<HTMLInputElement>
    | ChangeEvent<HTMLSelectElement>
    | ChangeEvent<HTMLTextAreaElement>
    | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  o: T,
  setObj: (v: React.SetStateAction<T>) => void,
  formatStr?: (s?: string) => string,
  decimalSeparator?: string,
  callback?: () => void,
) {
  updateState(e, o, setObj, decimalSeparator, formatStr, callback)
}
export function updateStateAndCallback<T>(
  e:
    | ChangeEvent<HTMLInputElement>
    | ChangeEvent<HTMLSelectElement>
    | ChangeEvent<HTMLTextAreaElement>
    | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  o: T,
  setObj: (v: React.SetStateAction<T>) => void,
  callback?: () => void,
  decimalSeparator?: string,
  formatStr?: (s?: string) => string,
) {
  updateState(e, o, setObj, decimalSeparator, formatStr, callback)
}
export function updateState<T>(
  e:
    | ChangeEvent<HTMLInputElement>
    | ChangeEvent<HTMLSelectElement>
    | ChangeEvent<HTMLTextAreaElement>
    | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  o: T,
  setObj: (v: React.SetStateAction<T>) => void,
  decimalSeparator?: string,
  formatStr?: (s?: string) => string,
  callback?: () => void,
) {
  const ctrl = e.target
  const v0: string = formatStr ? formatStr(ctrl.value) : ctrl.value
  const dataField = ctrl.getAttribute("data-field")
  const field = dataField ? dataField : ctrl.name
  if (ctrl.tagName === "SELECT") {
    if (ctrl.tagName === "SELECT") {
      if (v0 === "" || !v0) {
        ctrl.removeAttribute("data-value")
      } else {
        ctrl.setAttribute("data-value", v0)
      }
    }
    setValue(o, field, v0)
  } else {
    let stype = ctrl.getAttribute("type")
    const type: string = stype ? stype.toLowerCase() : "text"
    let model: any = o
    if (type === "checkbox") {
      let value = model[field]
      if (ctrl.id && ctrl.name !== ctrl.id) {
        if (!value || !Array.isArray(value)) {
          value = []
        }
        value.includes(v0) ? (value = value.filter((v: string) => v !== v0)) : value.push(v0)
        model[field] = value
      } else {
        const v = valueOfCheckbox(ctrl as HTMLInputElement)
        model[field] = v
      }
    } else if (type === "radio") {
      if (field.indexOf(".") < 0 && field.indexOf("[") < 0) {
        model[field] = v0
      } else {
        setValue(model, field, v0)
      }
    } else if (type === "date" || type === "datetime-local") {
      const date = new Date(v0)
      const val = !isNaN(date.getTime()) ? date.toISOString() : null
      setValue(model, field, val)
    } else if (type === "time") {
      const date = new Date(v0)
      if (!isNaN(date.getTime())) {
        setValue(model, field, date.getTime())
      } else {
        setValue(model, field, null)
      }
    } else {
      const datatype = ctrl.getAttribute("data-type")
      if (datatype === "phone") {
        const val = normalizePhone(v0)
        setValue(o, field, val)
      } else if (datatype === "fax") {
        const val = normalizeFax(v0)
        setValue(o, field, val)
      } else if (datatype === "integer") {
        let v = normalizeInteger(v0)
        if (v === "" || v == null) {
          setValue(o, field, undefined)
        } else {
          const val = isNaN(v as any) ? undefined : parseFloat(v)
          setValue(o, field, val)
        }
      } else if (datatype === "number") {
        const sep = decimalSeparator ? decimalSeparator : getDecimalSeparator(ctrl as HTMLInputElement)
        let v = sep === "," || sep === "٫" ? normalizeNumber(v0) : removeSeparators(v0)
        if (v === "" || v == null) {
          setValue(o, field, undefined)
        } else {
          const val = isNaN(v as any) ? undefined : parseFloat(v)
          setValue(o, field, val)
        }
      } else {
        setValue(o, field, v0)
      }
    }
  }
  setObj({ ...o })
  if (callback) {
    callback()
  }
}

export function valueOfCheckbox(ctrl: HTMLInputElement): string | number | boolean {
  const ctrlOnValue = ctrl.getAttribute("data-on-value")
  const ctrlOffValue = ctrl.getAttribute("data-off-value")
  if (ctrlOnValue && ctrlOffValue) {
    const onValue = ctrlOnValue ? ctrlOnValue : true
    const offValue = ctrlOffValue ? ctrlOffValue : false
    return ctrl.checked === true ? onValue : offValue
  } else {
    return ctrl.checked === true
  }
}
