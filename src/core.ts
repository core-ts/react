export interface LoadingService {
  showLoading(firstTime?: boolean): void
  hideLoading(): void
}
export const pageSizes = [12, 24, 60, 100, 120, 180, 300, 600]
export const sizes = pageSizes
// tslint:disable-next-line:class-name
export class resources {
  static _cache: any = {}
  static cache = true
  static fields = "fields"
  static page = "page"
  static limit = "limit"
  static defaultLimit = 24
  static limits = pageSizes
  static pageMaxSize = 7
  static getSortId(field: string): string {
    return field + "Sort"
  }
  static normalizePhone(phone?: string | null): string {
    return phone ? phone.replace(/[^+\d]/g, "") : ""
  }
  static normalizeFax(fax?: string | null): string {
    return fax ? fax.replace(/[^+\d]/g, "") : ""
  }
}
export function normalizePhone(phone?: string | null): string {
  return resources.normalizePhone(phone)
}
export function normalizeFax(fax?: string | null): string {
  return resources.normalizeFax(fax)
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

export interface Attribute {
  name?: string
  type?: Type
  typeof?: Attributes
}
export interface Attributes {
  [key: string]: Attribute
}
