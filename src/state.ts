import { ChangeEvent } from "react"
import { removeFaxFormat, removePhoneFormat } from "./core"
import { setValue } from "./reflect"

export function getDecimalSeparator(ele: HTMLInputElement): string {
  let separator = ele.getAttribute("data-decimal-separator")
  if (!separator) {
    const form = ele.form
    if (form) {
      separator = form.getAttribute("data-decimal-separator")
    }
  }
  return separator === "," ? "," : "."
}

const r1 = / |,|\$|€|£|¥|'|٬|،| /g
const r2 = / |\.|\$|€|£|¥|'|٬|،| /g
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
  let v = decimalSeparator === "," ? v0.replace(r2, "") : v0.replace(r1, "")
  if (v.indexOf(",") >= 0) {
    v = v.replace(",", ".")
  }
  const val = isNaN(v as any) ? undefined : parseInt(v)
  setValue(o, field, val)
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
  callback?: () => void,
) {
  updateState(e, o, setObj, callback, formatStr)
}
export function updateState<T>(
  e:
    | ChangeEvent<HTMLInputElement>
    | ChangeEvent<HTMLSelectElement>
    | ChangeEvent<HTMLTextAreaElement>
    | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  o: T,
  setObj: (v: React.SetStateAction<T>) => void,
  callback?: () => void,
  formatStr?: (s?: string) => string,
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
        const val = removePhoneFormat(v0)
        setValue(o, field, val)
      } else if (datatype === "fax") {
        const val = removeFaxFormat(v0)
        setValue(o, field, val)
      } else if (datatype === "number" || datatype === "int") {
        const decimalSeparator = getDecimalSeparator(ctrl as HTMLInputElement)
        let v = decimalSeparator === "," ? v0.replace(r2, "") : v0.replace(r1, "")
        if (v.indexOf(",") >= 0) {
          v = v.replace(",", ".")
        }
        const val = isNaN(v as any) ? undefined : parseFloat(v)
        setValue(o, field, val)
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
