import {Attribute, EditStatusConfig, ErrorMessage, LoadingService, Locale, Metadata, resource, ResourceService, UIService, ViewService} from './core';

export interface ResultInfo<T> {
  status: number|string;
  errors?: ErrorMessage[];
  value?: T;
  message?: string;
}
export interface EditParameter {
  resource: ResourceService;
  showMessage: (msg: string, option?: string) => void;
  showError: (m: string, header?: string, detail?: string, callback?: () => void) => void;
  confirm: (m2: string, header: string, yesCallback?: () => void, btnLeftText?: string, btnRightText?: string, noCallback?: () => void) => void;
  ui?: UIService;
  getLocale?: (profile?: string) => Locale;
  loading?: LoadingService;
  status?: EditStatusConfig;
}
export interface GenericService<T, ID, R> extends ViewService<T, ID> {
  patch?(obj: T, ctx?: any): Promise<R>;
  insert(obj: T, ctx?: any): Promise<R>;
  update(obj: T, ctx?: any): Promise<R>;
  delete?(id: ID, ctx?: any): Promise<number>;
}
export interface MetaModel {
  keys?: string[];
  version?: string;
}
export function build(model: Metadata): MetaModel {
  if (!model) {
    return null;
  }
  if (resource.cache) {
    let meta: MetaModel = resource._cache[model.name];
    if (!meta) {
      meta = buildMetaModel(model);
      resource._cache[model.name] = meta;
    }
    return meta;
  } else {
    return buildMetaModel(model);
  }
}

function buildMetaModel(model: Metadata): MetaModel {
  if (model && !model.source) {
    model.source = model.name;
  }
  const md: MetaModel = {};
  const pks: string[] = new Array<string>();
  const keys: string[] = Object.keys(model.attributes);
  for (const key of keys) {
    const attr: Attribute = model.attributes[key];
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

export function createModel<T>(model?: Metadata): T {
  const obj: any = {};
  if (!model) {
    return obj;
  }
  const attrs = Object.keys(model.attributes);
  for (const k of attrs) {
    const attr = model.attributes[k];
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
  return obj;
}

export function initPropertyNullInModel<T>(obj: T, m: Metadata): T {
  if (!m) {
    const x: any = {};
    return x;
  }
  const model = createModel(m);
  for (const key of Object.keys(model)) {
    if (obj && !obj.hasOwnProperty(key)) {
      obj[key] = model[key];
    }
  }
  return obj;
}
export function handleStatus(x: number|string, st: EditStatusConfig, gv: (k: string, p?: any) => string, se: (m: string, title?: string, detail?: string, callback?: () => void) => void): void {
  const title = gv('error');
  if (x === st.VersionError) {
    se(gv('error_version'), title);
  } else if (x === st.DataCorrupt) {
    se(gv('error_data_corrupt'), title);
  } else {
    se(gv('error_internal'), title);
  }
}
export function handleVersion<T>(obj: T, version: string) {
  if (obj && version && version.length > 0) {
    const v = obj[version];
    if (v && typeof v === 'number') {
      obj[version] = v + 1;
    } else {
      obj[version] = 1;
    }
  }
}
