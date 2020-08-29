import {formatter} from 'ui-plus';
import {Locale, storage} from 'uione';

export enum Type {
  ObjectId = 'ObjectId',
  Date = 'date',
  Boolean = 'boolean',

  Number = 'number',
  Integer = 'integer',
  String = 'string',
  Text = 'text',

  Object = 'object',
  Array = 'array',
  Primitives =  'primitives',
  Binary = 'binary'
}
export interface Metadata {
  name?: string;
  attributes: any;
  source?: string;
}
export interface Attribute {
  type: Type;
  key?: boolean;
  version?: boolean;
}

export function buildKeys(m: Metadata): string[] {
  const ks = Object.keys(m.attributes);
  const ps = [];
  for (const k of ks) {
    const attr: Attribute = m.attributes[k];
    if (attr.key === true) {
      ps.push(k);
    }
  }
  return ps;
}

export function buildId<ID>(keys: string[], props: any): ID {
  if (!keys || keys.length === 0 || !props) {
    return null;
  }
  const sp = (props.match ? props : props['props']);
  if (keys.length === 1) {
    const x = sp.match.params[keys[0]];
    if (x && x !== '') {
      return x;
    }
    return sp.match.params['id'];
  }
  const id: any = {};
  for (const key of keys) {
    let v = sp.match.params[key];
    if (!v) {
      v = sp[key];
      if (!v) {
        return null;
      }
    }
    id[key] = v;
  }
  return id;
}


export function dateToDefaultString(date: Date): string {
  return '' + date.getFullYear() + '-' + addZero(date.getMonth() + 1, 2) + '-' + addZero(date.getDate(), 2); // DateUtil.formatDate(date, 'YYYY-MM-DD');
}
function addZero(val: number, num: number): string {
  let v = val.toString();
  while (v.length < num) {
    v = '0' + v;
  }
  return v.toString();
}

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
