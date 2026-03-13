import queryString from "query-string"
import * as React from "react"
import { NavigateFunction } from "react-router-dom"
import { StringMap } from "./core"
import { hasDiff } from "./reflect"
import { Filter } from "./search"

export function onBack<T>(
  e: React.MouseEvent<HTMLElement, MouseEvent>,
  navigate: NavigateFunction,
  confirm: (msg: string, yesCallback?: () => void) => void,
  resource: StringMap,
  o1: T,
  o2?: T,
  keys?: string[],
  version?: string,
) {
  e.preventDefault()
  goBack(navigate, confirm, resource, o1, o2, keys, version)
}

export function goBack<T>(
  navigate: NavigateFunction,
  confirm: (msg: string, yesCallback?: () => void) => void,
  resource: StringMap,
  o1: T,
  o2?: T,
  keys?: string[],
  version?: string,
) {
  if (!o2) {
    navigate(-1)
  } else if (!hasDiff(o1, o2, keys, version)) {
    navigate(-1)
  } else {
    confirm(resource.msg_confirm_back, () => navigate(-1))
  }
}

export function buildFromUrl<T extends Filter>(model?: T): T {
  return buildParameters<T>(window.location.search, model)
}

export function buildParameters<T>(url: string, model?: T): T {
  var query = url
  var index = url.indexOf("?")

  if (index >= 0) {
    query = url.substring(index + 1)
  }

  var parsed = queryString.parse(query, {
    parseNumbers: true,
    parseBooleans: true,
  })

  return convertToObject(parsed as any, model)
}

export function convertToObject<T>(input: { [key: string]: any }, model?: T): T {
  if (model) {
    return mapToModel(input, model)
  }

  var output: any = {}

  for (var key in input) {
    if (!Object.prototype.hasOwnProperty.call(input, key)) {
      continue
    }

    var value = input[key]
    var keys = key.split(".")
    var current = output

    for (var i = 0; i < keys.length; i++) {
      var k = keys[i]

      if (i === keys.length - 1) {
        current[k] = parseValue(value)
      } else {
        if (!current[k]) {
          current[k] = {}
        }
        current = current[k]
      }
    }
  }

  return output as T
}

function mapToModel<T>(input: { [key: string]: any }, model: T): T {
  var result: any = {}
  var key: string

  for (key in model as any) {
    if (!Object.prototype.hasOwnProperty.call(model, key)) {
      continue
    }

    var modelValue = (model as any)[key]
    var inputValue = input[key]

    if (inputValue === undefined) {
      result[key] = modelValue
      continue
    }

    if (modelValue instanceof Date) {
      result[key] = new Date(inputValue)
    } else if (typeof modelValue === "number") {
      result[key] = Number(inputValue)
    } else if (typeof modelValue === "boolean") {
      result[key] = Boolean(inputValue)
    } else if (typeof modelValue === "string") {
      result[key] = String(inputValue)
    } else if (Object.prototype.toString.call(modelValue) === "[object Array]") {
      if (Object.prototype.toString.call(inputValue) === "[object Array]") {
        result[key] = inputValue
      } else {
        result[key] = [inputValue]
      }
    } else if (typeof modelValue === "object" && modelValue !== null) {
      result[key] = mapToModel(inputValue || {}, modelValue)
    } else {
      result[key] = inputValue
    }
  }

  return result
}

function parseValue(value: any): any {
  if (typeof value !== "string") {
    return value
  }

  if (!isNaN(Number(value))) {
    return Number(value)
  }

  if (value === "true") {
    return true
  }

  if (value === "false") {
    return false
  }

  return value
}
