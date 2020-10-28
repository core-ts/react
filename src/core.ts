import {focusFirstElement} from 'form-util';

// tslint:disable-next-line:class-name
export class resource {
  static phone = / |\-|\.|\(|\)/g;
  static _cache: any = {};
  static cache = true;
}
export function removePhoneFormat(phone: string): string {
  if (phone) {
    return phone.replace(resource.phone, '');
  } else {
    return phone;
  }
}
export interface ResourceService {
  resource(): any;
  value(key: string, param?: any): string;
  format(...args: any[]): string;
}
export interface Message {
  message: string;
  title?: string;
  yes?: string;
  no?: string;
}
export function message(r: ResourceService, msg: string, title?: string, yes?: string, no?: string): Message {
  const m2 = (msg && msg.length > 0 ? r.value(msg) : '');
  const m: Message = {
    message: m2
  };
  if (title && title.length > 0) {
    m.title = r.value(title);
  }
  if (yes && yes.length > 0) {
    m.yes = r.value(yes);
  }
  if (no && no.length > 0) {
    m.no = r.value(no);
  }
  return m;
}
export function messageByHttpStatus(status: number, r: ResourceService): string {
  let msg = r.value('error_internal');
  if (status === 401) {
    msg = r.value('error_unauthorized');
  } else if (status === 403) {
    msg = r.value('error_forbidden');
  } else if (status === 404) {
    msg = r.value('error_not_found');
  } else if (status === 410) {
    msg = r.value('error_gone');
  } else if (status === 503) {
    msg = r.value('error_service_unavailable');
  }
  return msg;
}

export interface Locale {
  id?: string;
  countryCode: string;
  dateFormat: string;
  firstDayOfWeek: number;
  decimalSeparator: string;
  groupSeparator: string;
  decimalDigits: number;
  currencyCode: string;
  currencySymbol: string;
  currencyPattern: number;
  currencySample?: string;
}
export interface LoadingService {
  showLoading(firstTime?: boolean): void;
  hideLoading(): void;
}
export interface ErrorMessage {
  field: string;
  code: string;
  param?: string|number|Date;
  message?: string;
}
export interface UIService {
  getValue(ctrl: any, locale?: Locale, currencyCode?: string): string|number|boolean;
  decodeFromForm(form: any, locale: Locale, currencyCode: string): any;

  validateForm(form: any, locale: Locale, focusFirst?: boolean, scroll?: boolean): boolean;
  removeFormError(form: any): void;
  removeErrorMessage(ctrl: any): void;
  showFormError(form: any, errors: ErrorMessage[], focusFirst?: boolean): ErrorMessage[];
  buildErrorMessage(errors: ErrorMessage[]): string;

  initMaterial(form: any): void;
}
export interface AlertService {
  confirm(msg: string, header: string, yesCallback?: () => void, btnLeftText?: string, btnRightText?: string, noCallback?: () => void): void;
  alertError(msg: string, header?: string, detail?: string, callback?: () => void): void;
}

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

export function initForm(form: any, initMat?: (f: any) => void) {
  if (form) {
    setTimeout(() => {
      if (initMat) {
        initMat(form);
      }
      focusFirstElement(form);
    }, 100);
  }
  return form;
}
