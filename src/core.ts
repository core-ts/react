import { Params } from "react-router"
import { focusFirstElement } from "./formutil"

export interface LoadingService {
  showLoading(firstTime?: boolean): void
  hideLoading(): void
}
export const pageSizes = [12, 24, 60, 100, 120, 180, 300, 600]
// tslint:disable-next-line:class-name
export class resources {
  static phone = / |-|\.|\(|\)/g
  static _cache: any = {}
  static cache = true
  static fields = "fields"
  static page = "page"
  static limit = "limit"
  static defaultLimit = 24
  static limits = pageSizes
  static pageMaxSize = 7
}
export const size = pageSizes

export function getCurrencyCode(form?: HTMLFormElement | null): string | undefined {
  if (form) {
    const x = form.getAttribute("currency-code")
    if (x) {
      return x
    }
  }
  return undefined
}
export function removePhoneFormat(phone: string): string {
  if (phone) {
    return phone.replace(resources.phone, "")
  } else {
    return phone
  }
}
export interface StringMap {
  [key: string]: string
}
export interface ResourceService {
  resource(): StringMap
  value(key: string, param?: any): string
  format(f: string, ...args: any[]): string
}

export interface Locale {
  id?: string
  countryCode: string
  dateFormat: string
  firstDayOfWeek: number
  decimalSeparator: string
  groupSeparator: string
  decimalDigits: number
  currencyCode: string
  currencySymbol: string
  currencyPattern: number
  currencySample?: string
}
export interface ErrorMessage {
  field: string
  code: string
  param?: string | number | Date
  message?: string
}
export interface UIService {
  getValue(el: HTMLInputElement, locale?: Locale, currencyCode?: string): string | number | boolean | null | undefined
  // decodeFromForm(form: HTMLFormElement, locale?: Locale, currencyCode?: string | null): any;

  validateForm(form?: HTMLFormElement, locale?: Locale, focusFirst?: boolean, scroll?: boolean): boolean
  removeFormError(form: HTMLFormElement): void
  removeError(el: HTMLInputElement): void
  showFormError(form?: HTMLFormElement, errors?: ErrorMessage[], focusFirst?: boolean): ErrorMessage[]
  buildErrorMessage(errors: ErrorMessage[]): string

  registerEvents?(form: HTMLFormElement): void
}

export type DataType =
  | "ObjectId"
  | "date"
  | "datetime"
  | "time"
  | "boolean"
  | "number"
  | "integer"
  | "string"
  | "text"
  | "object"
  | "array"
  | "binary"
  | "primitives"
  | "booleans"
  | "numbers"
  | "integers"
  | "strings"
  | "dates"
  | "datetimes"
  | "times"
/*
export interface Metadata {
  name?: string;
  attributes: Attributes;
  source?: string;
}
*/
export interface Attribute {
  name?: string
  type?: DataType
  key?: boolean
  version?: boolean
  typeof?: Attributes
}
export interface Attributes {
  [key: string]: Attribute
}

export function buildKeys(attributes: Attributes): string[] {
  if (!attributes) {
    return []
  }
  const ks = Object.keys(attributes)
  const ps = []
  for (const k of ks) {
    const attr: Attribute = attributes[k]
    if (attr.key === true) {
      ps.push(k)
    }
  }
  return ps
}
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
export function buildId<ID>(p: Readonly<Params<string>>, keys?: string[]): ID | null {
  if (!keys || keys.length === 0 || keys.length === 1) {
    if (keys && keys.length === 1) {
      if (p[keys[0]]) {
        return p[keys[0]] as any
      }
    }
    return p["id"] as any
  }
  const id: any = {}
  for (const key of keys) {
    let v = p[key]
    if (!v) {
      v = p[key]
      if (!v) {
        return null
      }
    }
    id[key] = v
  }
  return id
}
export const datetimeToString = (inputDate: Date) => {
  const date = new Date(inputDate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

export const dateToString = (inputDate: Date) => {
  const year = inputDate.getFullYear()
  const month = String(inputDate.getMonth() + 1).padStart(2, "0")
  const day = String(inputDate.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
/*
export function formatFax(value: string) {
  return formatter.formatFax(value);
}

export function formatPhone(value: string) {
  return formatter.formatPhone(value);
}
export function formatNumber(num: string|number, scale?: number, locale?: Locale): string {
  if (!scale) {
    scale = 2;
  }
  if (!locale) {
    locale = storage.getLocale();
  }
  let c: number;
  if (!num) {
    return '';
  } else if (typeof num === 'number') {
    c = num;
  } else {
    const x: any = num;
    if (isNaN(x)) {
      return '';
    } else {
      c = parseFloat(x);
    }
  }
  return storage.locale().formatNumber(c, scale, locale);
}

export function formatCurrency(currency: string|number, locale?: Locale, currencyCode?: string) {
  if (!currencyCode) {
    currencyCode = 'USD';
  }
  if (!locale) {
    locale = storage.getLocale();
  }
  let c: number;
  if (!currency) {
    return '';
  } else if (typeof currency === 'number') {
    c = currency;
  } else {
    let x: any = currency;
    x = x.replace(locale.decimalSeparator, '.');
    if (isNaN(x)) {
      return '';
    } else {
      c = parseFloat(x);
    }
  }
  return storage.locale().formatCurrency(c, currencyCode, locale);
}
*/

export function initForm(form?: HTMLFormElement, initMat?: (f: HTMLFormElement) => void): HTMLFormElement | undefined {
  if (form) {
    setTimeout(() => {
      if (initMat) {
        initMat(form)
      }
      focusFirstElement(form)
    }, 100)
  }
  return form
}
export function getName(d: string, n?: string): string {
  return n && n.length > 0 ? n : d
}
export function getModelName(form?: HTMLFormElement | null, name?: string): string {
  if (form) {
    const a = form.getAttribute("model-name")
    if (a && a.length > 0) {
      return a
    }
    const b = form.name
    if (b) {
      if (b.endsWith("Form")) {
        return b.substr(0, b.length - 4)
      }
      return b
    }
  }
  if (name && name.length > 0) {
    return name
  }
  return ""
}

export const scrollToFocus = (e: any, isUseTimeOut?: boolean) => {
  try {
    const element = e.target as HTMLInputElement
    const form = element.form
    if (form) {
      const container = form.childNodes[1] as HTMLElement
      const elementRect = element.getBoundingClientRect()
      const absoluteElementTop = elementRect.top + window.pageYOffset
      const middle = absoluteElementTop - window.innerHeight / 2
      const scrollTop = container.scrollTop
      const timeOut = isUseTimeOut ? 300 : 0
      const isChrome = navigator.userAgent.search("Chrome") > 0
      setTimeout(() => {
        if (isChrome) {
          const scrollPosition = scrollTop === 0 ? elementRect.top + 64 : scrollTop + middle
          container.scrollTo(0, Math.abs(scrollPosition))
        } else {
          container.scrollTo(0, Math.abs(scrollTop + middle))
        }
      }, timeOut)
    }
  } catch (e) {
    console.log(e)
  }
}
export interface LoadingParameter {
  loading?: LoadingService
}
export function showLoading(s?: LoadingService): void {
  if (s) {
    s.showLoading()
  }
}
export function hideLoading(s?: LoadingService): void {
  if (s) {
    s.hideLoading()
  }
}
export interface UIParameter {
  ui?: UIService
}
export function getRemoveError(u?: UIParameter, rmErr?: (el: HTMLInputElement) => void): ((el: HTMLInputElement) => void) | undefined {
  if (rmErr) {
    return rmErr
  }
  return u && u.ui ? u.ui.removeError : undefined
}
export function removeFormError(u?: UIParameter, f?: HTMLFormElement): void {
  if (f && u && u.ui) {
    u.ui.removeFormError(f)
  }
}
export function getValidateForm(
  u?: UIParameter,
  vf?: (form: HTMLFormElement, locale?: Locale, focusFirst?: boolean, scroll?: boolean) => boolean,
): ((form: HTMLFormElement, locale?: Locale, focusFirst?: boolean, scroll?: boolean) => boolean) | undefined {
  if (vf) {
    return vf
  }
  return u && u.ui ? u.ui.validateForm : undefined
}
/*
export function getDecodeFromForm(u?: UIParameter, d?: (form: HTMLFormElement, locale?: Locale, currencyCode?: string) => any): ((form: HTMLFormElement, locale?: Locale, currencyCode?: string) => any) | undefined {
  if (d) {
    return d;
  }
  return (u && u.ui ? u.ui.decodeFromForm : undefined);
}
*/
