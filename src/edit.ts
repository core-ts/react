import { NavigateFunction } from 'react-router-dom';
import {Attribute, Attributes, ErrorMessage, LoadingService, Locale, resources, ResourceService, StringMap, UIService, ViewService} from './core';

export interface ResultInfo<T> {
  status: number|string;
  errors?: ErrorMessage[];
  value?: T;
  message?: string;
}
export interface EditParameter {
  resource: ResourceService;
  showMessage: (msg: string, option?: string) => void;
  showError: (m: string, callback?: () => void, header?: string) => void;
  confirm: (m2: string, yesCallback?: () => void, header?: string, btnLeftText?: string, btnRightText?: string, noCallback?: () => void) => void;
  ui?: UIService;
  getLocale?: (profile?: string) => Locale;
  loading?: LoadingService;
  // status?: EditStatusConfig;
}
export interface GenericService<T, ID, R> extends ViewService<T, ID> {
  patch?(obj: Partial<T>, ctx?: any): Promise<R>;
  create(obj: T, ctx?: any): Promise<R>;
  update(obj: T, ctx?: any): Promise<R>;
  delete?(id: ID, ctx?: any): Promise<number>;
}
export interface MetaModel {
  keys?: string[];
  version?: string;
}
export function build(attributes: Attributes, name?: string): MetaModel|undefined {
  if (!attributes) {
    return undefined;
  }
  if (resources.cache && name && name.length > 0) {
    let meta: MetaModel = resources._cache[name];
    if (!meta) {
      meta = buildMetaModel(attributes);
      resources._cache[name] = meta;
    }
    return meta;
  } else {
    return buildMetaModel(attributes);
  }
}

function buildMetaModel(attributes: Attributes): MetaModel {
  if (!attributes) {
    return {};
  }
  /*
  if (model && !model.source) {
    model.source = model.name;
  }
  */
  const md: MetaModel = {};
  const pks: string[] = new Array<string>();
  const keys: string[] = Object.keys(attributes);
  for (const key of keys) {
    const attr: Attribute = attributes[key];
    if (attr) {
      if (attr.version) {
        md.version = key;
      }
      if (attr.key === true) {
        pks.push(key);
      }
    }
  }
  md.keys = pks;
  return md;
}

export function createModel<T>(attributes?: Attributes): T {
  const obj: any = {};
  if (!attributes) {
    return obj;
  }
  const attrs = Object.keys(attributes);
  for (const k of attrs) {
    const attr = attributes[k];
    if (attr.name) {
      switch (attr.type) {
        case 'string':
        case 'text':
          obj[attr.name] = '';
          break;
        case 'integer':
        case 'number':
          obj[attr.name] = 0;
          break;
        case 'array':
          obj[attr.name] = [];
          break;
        case 'boolean':
          obj[attr.name] = false;
          break;
        case 'date':
          obj[attr.name] = new Date();
          break;
        case 'object':
          if (attr.typeof) {
            const object = createModel(attr.typeof);
            obj[attr.name] = object;
            break;
          } else {
            obj[attr.name] = {};
            break;
          }
        case 'ObjectId':
          obj[attr.name] = null;
          break;
        default:
          obj[attr.name] = '';
          break;
      }
    }
  }
  return obj;
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
export function handleVersion<T>(obj: T, version?: string): void {
  if (obj && version && version.length > 0) {
    const v = (obj as any)[version];
    if (v && typeof v === 'number') {
      (obj as any)[version] = v + 1;
    } else {
      (obj as any)[version] = 1;
    }
  }
}
export function isSuccessful<T>(x: number|T|ErrorMessage[]): boolean {
  if (Array.isArray(x)) {
    return false;
  } else if (typeof x === 'object') {
    return true;
  } else if (typeof x === 'number' && x > 0) {
    return true;
  }
  return false;
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
