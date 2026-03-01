import { ChangeEvent } from "react"
import { Locale, removeFaxFormat, removePhoneFormat } from "./core"
import { setValue } from "./reflect"
import { valueOf } from "./util"

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
  e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
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
  e: ChangeEvent<HTMLInputElement, HTMLInputElement> | ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>,
  o: T,
  setObj: (v: React.SetStateAction<T>) => void,
  formatStr?: (s?: string) => string,
  callback?: () => void,
) {
  updateState(e, o, setObj, callback, formatStr)
}
export function updateState<T>(
  e: ChangeEvent<HTMLInputElement, HTMLInputElement> | ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>,
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

export const enLocale = {
  id: "en-US",
  countryCode: "US",
  dateFormat: "M/d/yyyy",
  firstDayOfWeek: 1,
  decimalSeparator: ".",
  groupSeparator: ",",
  decimalDigits: 2,
  currencyCode: "USD",
  currencySymbol: "$",
  currencyPattern: 0,
}
export function localeOf(lc?: Locale, glc?: (() => Locale) | Locale): Locale {
  let l: Locale | undefined = lc
  if (!l) {
    if (glc) {
      if (typeof glc === "function") {
        l = glc()
      } else {
        l = glc
      }
    }
    if (!l) {
      l = enLocale
    }
  }
  return l
}
export function handleEvent(e: any, removeErr?: (ctrl: HTMLInputElement) => void) {
  const ctrl = e.currentTarget as HTMLInputElement
  const type = ctrl.getAttribute("type")
  const isPreventDefault = type && (["checkbox", "radio"].indexOf(type.toLowerCase()) >= 0 ? false : true)
  if (isPreventDefault) {
    e.preventDefault()
  }
  if (removeErr && ctrl.nodeName === "SELECT" && ctrl.value && ctrl.classList.contains("invalid")) {
    removeErr(ctrl)
  }
}

export interface ModelMap {
  [key: string]: any
}
export interface ModelProps {
  setGlobalState?: (m: ModelMap) => void
  shouldBeCustomized?: boolean
}
export function handleProps<P extends ModelProps>(
  e: any,
  props: P,
  ctrl: HTMLInputElement,
  modelName: string,
  tloc: Locale,
  prepareData?: (data: any) => void,
) {
  if (props.setGlobalState) {
    const res = valueOf(ctrl, tloc, e.type)
    if (res.mustChange) {
      const dataField = ctrl.getAttribute("data-field")
      const field = dataField ? dataField : ctrl.name
      const propsDataForm = (props as any)[modelName]
      const form = ctrl.form
      if (form) {
        const formName = form.name
        if (field.indexOf(".") < 0 && field.indexOf("[") < 0) {
          const data = props.shouldBeCustomized && prepareData ? prepareData({ [ctrl.name]: res.value }) : { [ctrl.name]: res.value }
          props.setGlobalState({ [formName]: { ...propsDataForm, ...data } })
        } else {
          setValue(propsDataForm, field, ctrl.value)
          props.setGlobalState({ [formName]: { ...propsDataForm } })
        }
      }
    }
  }
}
export function buildState<S, K extends keyof S>(e: any, state: Readonly<S>, ctrl: HTMLInputElement, modelName: string, tloc: Locale): K | undefined {
  const form = ctrl.form
  if (form) {
    if (modelName && modelName !== "") {
      const type = ctrl.getAttribute("type")
      const ex = (state as any)[modelName]
      const dataField = ctrl.getAttribute("data-field")
      const field = dataField ? dataField : ctrl.name
      const model = Object.assign({}, ex)
      if (type && type.toLowerCase() === "checkbox") {
        let value = model[field]
        if (ctrl.id && ctrl.name !== ctrl.id) {
          if (!value || !Array.isArray(value)) {
            value = []
          }
          value.includes(ctrl.value) ? (value = value.filter((v: string) => v !== ctrl.value)) : value.push(ctrl.value)
          // if (dType == 'array'){
          //   if (value === 'string'){
          //     value = [value]
          //   }
          // }
          model[field] = value
          // console.log(model,  modelName, model, model[field], field, value )
          // setValue(model, field, value);
        } else {
          const v = valueOfCheckbox(ctrl)
          model[field] = v
        }
        const objSet: any = {}
        objSet[modelName] = model
        return objSet
      } else if (type && type.toLowerCase() === "radio") {
        if (field.indexOf(".") < 0 && field.indexOf("[") < 0) {
          model[field] = ctrl.value
        } else {
          setValue(model, field, ctrl.value)
        }
        const objSet: any = {}
        objSet[modelName] = model
        return objSet
      } else if (type && (type.toLowerCase() === "date" || type.toLowerCase() === "datetime-local")) {
        const objSet: any = {}
        try {
          const selectedDate = new Date(ctrl.value)
          setValue(model, field, ctrl.value && ctrl.value !== "" ? selectedDate.toISOString() : null)
          objSet[modelName] = model
          return objSet
        } catch (error) {
          console.error("Error occurred while formatting date:", error)
        }
        return objSet
      } else if (type && type.toLowerCase() === "time") {
        const objSet: any = {}
        try {
          const selectedDate = new Date(ctrl.value)
          setValue(model, field, selectedDate.getTime())
          objSet[modelName] = model
          return objSet
        } catch (error) {
          console.error("Error occurred while formatting time:", error)
        }
        return objSet
      } else {
        if (ctrl.tagName === "SELECT") {
          if (ctrl.value === "" || !ctrl.value) {
            ctrl.removeAttribute("data-value")
          } else {
            ctrl.setAttribute("data-value", "data-value")
          }
        }
        const data = valueOf(ctrl, tloc, e.type)
        if (data.mustChange) {
          if (field.indexOf(".") < 0 && field.indexOf("[") < 0) {
            model[field] = data.value
          } else {
            setValue(model, field, data.value)
          }
          const objSet: any = {}
          objSet[modelName] = model
          return objSet
        }
      }
    } else {
      return buildFlatState(e, state, tloc)
    }
  } else {
    buildFlatState(e, state, tloc)
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
export function buildFlatState<S, K extends keyof S>(e: any, state: Readonly<S>, l?: Locale): K | undefined {
  const ctrl = e.currentTarget as HTMLInputElement
  const stateName = ctrl.name
  const objSet: any = {}
  const type = ctrl.getAttribute("type")
  if (type && type.toLowerCase() === "checkbox") {
    if (ctrl.id && stateName === ctrl.id) {
      const v = valueOfCheckbox(ctrl)
      objSet[stateName] = v
      return objSet
    } else {
      let value = (state as any)[stateName]
      value.includes(ctrl.value) ? (value = value.filter((v: string) => v !== ctrl.value)) : value.push(ctrl.value)
      const objSet2: any = { [ctrl.name]: value }
      return objSet2
    }
  } else {
    const data = valueOf(ctrl, l, e.type)
    if (data.mustChange) {
      objSet[stateName] = data.value
      return objSet
    } else {
      return undefined
    }
  }
}
