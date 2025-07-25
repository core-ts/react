import { LoadingService } from "./core"
import { clone } from "./reflect"

export interface DiffParameter {
  showMessage: (msg: string, option?: string) => void
  showError: (m: string, header?: string, detail?: string, callback?: () => void) => void
  loading?: LoadingService
}
export interface BaseDiffState {
  disabled: boolean
}
export interface DiffModel<T, ID> {
  id?: ID
  origin?: T
  value: T
}
export interface ApprService<ID> {
  approve(id: ID, ctx?: any): Promise<number | string>
  reject(id: ID, ctx?: any): Promise<number | string>
}
export interface DiffService<T, ID> {
  keys(): string[]
  diff(id: ID, ctx?: any): Promise<DiffModel<T, ID>>
}
export interface DiffApprService<T, ID> extends DiffService<T, ID>, ApprService<ID> {}
export interface DiffState<T> {
  origin: T
  value: T
  disabled: boolean
}

export function formatDiffModel<T, ID>(obj: DiffModel<T, ID>, formatFields?: (obj3: T) => T): DiffModel<T, ID> {
  if (!obj) {
    return obj
  }
  const obj2 = clone(obj)
  if (!obj2.origin) {
    obj2.origin = {}
  } else {
    if (typeof obj2.origin === "string") {
      obj2.origin = JSON.parse(obj2.origin)
    }
    if (formatFields && typeof obj2.origin === "object" && !Array.isArray(obj2.origin)) {
      obj2.origin = formatFields(obj2.origin)
    }
  }
  if (!obj2.value) {
    obj2.value = {}
  } else {
    if (typeof obj2.value === "string") {
      obj2.value = JSON.parse(obj2.value)
    }
    if (formatFields && typeof obj2.value === "object" && !Array.isArray(obj2.value)) {
      obj2.value = formatFields(obj2.value)
    }
  }
  return obj2
}

export function getDataFields(form?: HTMLElement | null): HTMLElement[] {
  let results: HTMLElement[] = []
  if (!form) {
    return results
  }
  const attributeValue = form.getAttribute("data-field")
  if (attributeValue && attributeValue.length > 0) {
    results.push(form)
  }
  const childNodes = form.childNodes
  if (childNodes.length > 0) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i] as HTMLElement
      if (childNode.nodeType === Node.ELEMENT_NODE) {
        results = results.concat(getDataFields(childNode))
      }
    }
  }
  return results
}
