import { NavigateFunction } from "react-router-dom"
import { Attributes, ErrorMessage, StringMap } from "./core"

export function createModel<T>(attributes?: Attributes): T {
  const obj: any = {}
  if (!attributes) {
    return obj
  }
  const attrs = Object.keys(attributes)
  for (const k of attrs) {
    const attr = attributes[k]
    if (attr.name) {
      switch (attr.type) {
        case "string":
        case "text":
          obj[attr.name] = ""
          break
        case "integer":
        case "number":
          obj[attr.name] = 0
          break
        case "array":
          obj[attr.name] = []
          break
        case "boolean":
          obj[attr.name] = false
          break
        case "date":
          obj[attr.name] = new Date()
          break
        case "object":
          if (attr.typeof) {
            const object = createModel(attr.typeof)
            obj[attr.name] = object
            break
          } else {
            obj[attr.name] = {}
            break
          }
        case "ObjectId":
          obj[attr.name] = null
          break
        default:
          obj[attr.name] = ""
          break
      }
    }
  }
  return obj
}
/*
export function initPropertyNullInModel<T>(obj: T, m?: Attributes): T {
  if (!m) {
    const x: any = {};
    return x;
  }
  const model = createModel(m);
  for (const key of Object.keys(model as any)) {
    if (obj && !(obj as any).hasOwnProperty(key)) {
      (obj as any)[key] = (model as any)[key];
    }
  }
  return obj;
}
export function handleStatus(x: number|string, st: EditStatusConfig, gv: (k: string, p?: any) => string, se: (m: string, title?: string, detail?: string, callback?: () => void) => void): void {
  const title = gv('error');
  if (x === st.version_error) {
    se(gv('error_version'), title);
  } else if (x === st.data_corrupt) {
    se(gv('error_data_corrupt'), title);
  } else {
    se(gv('error_internal'), title);
  }
}
*/
export function isSuccessful<T>(x: number | T | ErrorMessage[]): boolean {
  if (Array.isArray(x)) {
    return false
  } else if (typeof x === "object") {
    return true
  } else if (typeof x === "number" && x > 0) {
    return true
  }
  return false
}
type Result<T> = number | T | ErrorMessage[]
export function afterSaved<T>(
  res: Result<T>,
  form: HTMLFormElement | undefined,
  resource: StringMap,
  showFormError: (form?: HTMLFormElement, errors?: ErrorMessage[]) => ErrorMessage[],
  alertSuccess: (msg: string, callback?: () => void) => void,
  alertError: (msg: string) => void,
  navigate?: NavigateFunction,
) {
  if (Array.isArray(res)) {
    showFormError(form, res)
  } else if (isSuccessful(res)) {
    alertSuccess(resource.msg_save_success, () => {
      if (navigate) {
        navigate(-1)
      }
    })
  } else if (res === 0) {
    alertError(resource.error_not_found)
  } else {
    alertError(resource.error_conflict)
  }
}
