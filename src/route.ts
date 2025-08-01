import queryString from "query-string"
import { NavigateFunction } from "react-router-dom"
import { StringMap } from "./core"
import { hasDiff } from "./reflect"
import { Filter } from "./search"

export function goBack<T>(
  navigate: NavigateFunction,
  confirm: (msg: string, yesCallback?: () => void) => void,
  resource: StringMap,
  o1: T,
  o2: T,
  keys?: string[],
  version?: string,
) {
  if (!hasDiff(o1, o2, keys, version)) {
    navigate(-1)
  } else {
    confirm(resource.msg_confirm_back, () => navigate(-1))
  }
}

export function buildFromUrl<S extends Filter>(modelT?: S): S {
  return buildParameters<S>(window.location.search, modelT)
}
export function buildParameters<T>(url: string, model?: T): T {
  let urlSearch = url
  const i = urlSearch.indexOf("?")
  if (i >= 0) {
    urlSearch = url.substring(i + 1)
  }
  try {
    const parsed: any = convertToObject<T>(queryString.parse(urlSearch), model)
    return parsed
  } catch (error) {
    console.log(error)
    throw error
  }
}

export function convertToObject<T>(input: any, model?: T): T {
  if (model) {
    return parseToModel(input, model)
  }
  const output: any = {}

  for (let key in input) {
    const value = input[key]
    const keys = key.split(".")

    let currentObj: any = output
    for (let i = 0; i < keys.length; i++) {
      const currentKey = keys[i]

      if (!currentObj[currentKey]) {
        if (i === keys.length - 1) {
          currentObj[currentKey] = parseValue(value)
        } else {
          currentObj[currentKey] = {}
        }
      }

      currentObj = currentObj[currentKey]
    }
  }

  return output as T
}

function parseToModel(dest: any, src: any) {
  if (typeof dest !== "object" || typeof src !== "object") {
    return dest
  }
  for (let key in src) {
    if (!Object.hasOwn(dest, key)) continue
    if (src.hasOwnProperty(key)) {
      if (src[key] && src[key].constructor === Object) {
        if (!dest[key] || dest[key].constructor !== Object) {
          dest[key] = {}
        }
        parseToModel(dest[key], src[key])
      } else if (src[key] instanceof Date) {
        dest[key] = new Date(dest[key])
      } else if (typeof src[key] === "boolean") {
        if (dest[key].length > 0) {
          dest[key] = new Boolean(dest[key])
        }
      } else if (typeof src[key] === "number") {
        if (typeof dest[key] === "string" && dest[key].indexOf(".") !== -1) {
          dest[key] = parseFloat(dest[key])
        } else {
          dest[key] = parseInt(dest[key], 10)
        }
      } else if (typeof src[key] === "string") {
        if (dest[key]) {
          dest[key] = dest[key].toString()
        }
      }
    }
  }
  return dest
}

function parseValue(value: any): any {
  // Check if the value is a string representing a number and parse it to a number
  if (!isNaN(value) && !isNaN(parseFloat(value))) {
    return parseFloat(value)
  }
  return value
}
