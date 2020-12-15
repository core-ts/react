
import {Attribute, ErrorMessage, Metadata, resource, ResourceService, Type} from './core';

export enum Status {
  DuplicateKey = 0,
  NotFound = 0,
  Success = 1,
  VersionError = 2,
  Error = 4,
  DataCorrupt = 8
}
export interface ResultInfo<T> {
  status: Status;
  errors?: ErrorMessage[];
  value?: T;
  message?: string;
}

export interface MetaModel {
  keys?: string[];
  version?: string;
}
export function build(model: Metadata): MetaModel {
  if (!model){
    return null;
  }
  if (resource.cache){
    let meta: MetaModel = resource._cache[model.name];
    if (!meta){
      meta = buildMetaModel(model);
      resource._cache[model.name] = meta;
    }
    return meta;
  } else {
    return buildMetaModel(model);
  }
}

function buildMetaModel(model: Metadata): MetaModel {
  if (model && !model.source){
    model.source = model.name;
  }
  const md: MetaModel = {};
  const pks: string[] = new Array<string>();
  const keys: string[] = Object.keys(model.attributes);
  for (const key of keys){
    const attr: Attribute = model.attributes[key];
    if (attr){
      if (attr.version){
        md.version = key;
      }
      if (attr.key === true){
        pks.push(key);
      }
    }
  }
  md.keys = pks;
  return md;
}

export function createModel(model: Metadata): any {
  const obj: any = {};
  const attrs = Object.keys(model.attributes);
  for (const k of attrs){
    const attr = model.attributes[k];
    switch (attr.type){
      case Type.String:
      case Type.Text:
        obj[attr.name] = '';
        break;
      case Type.Integer:
      case Type.Number:
        obj[attr.name] = 0;
        break;
      case Type.Array:
        obj[attr.name] = [];
        break;
      case Type.Boolean:
        obj[attr.name] = false;
        break;
      case Type.Date:
        obj[attr.name] = new Date();
        break;
      case Type.Object:
        if (attr.typeof){
          const object = this.createModel(attr.typeof);
          obj[attr.name] = object;
          break;
        } else {
          obj[attr.name] = {};
          break;
        }
      case Type.ObjectId:
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
  for (const key of Object.keys(model)){
    if (obj && !obj.hasOwnProperty(key)){
      obj[key] = model[key];
    }
  }
  return obj;
}

export function buildMessageFromStatusCode(status: Status, r: ResourceService): string {
  if (status === Status.DuplicateKey){
    return r.value('error_duplicate_key');
  } else if (status === Status.VersionError){ // Below message for update only, not for add
    return r.value('error_version');
  } else if (status === Status.DataCorrupt){
    return r.value('error_data_corrupt');
  } else {
    return '';
  }
}

export function handleVersion<T>(obj: T, version: string){
  if (obj && version && version.length > 0){
    const v = obj[version];
    if (v && typeof v === 'number'){
      obj[version] = v + 1;
    } else {
      obj[version] = 1;
    }
  }
}
