export interface LoadingService {
  showLoading(firstTime?: boolean): void
  hideLoading(): void
}
export const pageSizes = [12, 24, 60, 100, 120, 180, 300, 600]
export const sizes = pageSizes
// tslint:disable-next-line:class-name
export class resources {
  static phone = / |\-|\.|\(|\)/g
  static _cache: any = {}
  static cache = true
  static fields = "fields"
  static page = "page"
  static limit = "limit"
  static defaultLimit = 24
  static limits = pageSizes
  static pageMaxSize = 7
}

export interface StringMap {
  [key: string]: string
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
  validateForm(form?: HTMLFormElement, locale?: Locale, focusFirst?: boolean, scroll?: boolean): boolean
  removeFormError(form: HTMLFormElement): void
  removeError(el: HTMLInputElement): void
  showFormError(form?: HTMLFormElement, errors?: ErrorMessage[], focusFirst?: boolean): ErrorMessage[]
  buildErrorMessage(errors: ErrorMessage[]): string

  registerEvents?(form: HTMLFormElement): void
}

export type Type =
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

export type Format = "currency" | "percentage" | "email" | "url" | "phone" | "fax" | "ipv4" | "ipv6"

export interface Attribute {
  name?: string
  type?: Type
  format?: Format
  key?: boolean
  version?: boolean
  typeof?: Attributes
  scale?: number
  noformat?: boolean
}
export interface Attribute {
  name?: string
  type?: Type
  key?: boolean
  version?: boolean
  typeof?: Attributes
}
export interface Attributes {
  [key: string]: Attribute
}
