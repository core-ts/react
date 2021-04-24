import * as React from 'react';
import {clone, diff} from 'reflectx';
import {buildId, createDiffStatus, DiffStatusConfig, error, HistoryProps, LoadingService, message, ResourceService, StringMap} from './core';
import {getDiffStatusFunc, getErrorFunc, getLoadingFunc, getMsgFunc, getResource} from './input';

export interface DiffParameter {
  resource: ResourceService;
  showMessage: (msg: string, option?: string) => void;
  showError: (m: string, header?: string, detail?: string, callback?: () => void) => void;
  loading?: LoadingService;
  status?: DiffStatusConfig;
}
export interface BaseDiffState {
  disabled: boolean;
}

export interface DiffModel<T, ID> {
  id?: ID;
  origin?: T;
  value: T;
}

export class BaseDiffApprComponent<T, ID, P extends HistoryProps, S extends BaseDiffState> extends React.Component<P, S & any> {
  constructor(props: P, protected keys: string[], protected resourceService: ResourceService,
      protected showMessage: (msg: string, option?: string) => void,
      protected showError: (m: string, title?: string, detail?: string, callback?: () => void) => void,
      protected loading?: LoadingService,
      protected status?: DiffStatusConfig,
    ) {
    super(props);
    // this._id = props['props'].match.params.id || props['props'].match.params.cId || props.match.params.cId;
    // this.callBackAfterUpdate = this.callBackAfterUpdate.bind(this);
    this.resource = resourceService.resource();
    this.showMessage = this.showMessage.bind(this);
    this.showError = this.showError.bind(this);
    this.back = this.back.bind(this);
    this.initModel = this.initModel.bind(this);
    this.postApprove = this.postApprove.bind(this);
    this.postReject = this.postReject.bind(this);
    this.format = this.format.bind(this);
    this.handleNotFound = this.handleNotFound.bind(this);
    if (!this.status) {
      this.status = createDiffStatus();
    }
    this.state = {
      disabled: false
    };
  }
  protected id: ID;
  protected form: HTMLFormElement;
  protected running: boolean;
  protected resource: StringMap;

  protected back(event: any) {
    if (event) {
      event.preventDefault();
    }
    this.props.history.goBack();
  }

  protected initModel(): T {
    const x: any = {};
    return x;
  }

  protected postApprove(s: number|string, err?: any) {
    this.setState({ disabled: true });
    const r = this.resourceService;
    const st = this.status;
    if (s === st.Success) {
      this.showMessage(r.value('msg_approve_success'));
    } else if (s === st.VersionError) {
      const msg = message(r.value, 'msg_approve_version_error', 'error');
      this.showError(msg.message, msg.title);
    } else if (s === st.NotFound) {
      this.handleNotFound();
    } else {
      error(err, r.value, this.showError);
    }
  }

  protected postReject(status: number|string, err?: any) {
    this.setState({ disabled: true });
    const r = this.resourceService;
    const st = this.status;
    if (status === st.Success) {
      this.showMessage(r.value('msg_reject_success'));
    } else if (status === st.VersionError) {
      const msg = message(r.value, 'msg_approve_version_error', 'error');
      this.showError(msg.message, msg.title);
    } else if (status === st.NotFound) {
      this.handleNotFound();
    } else {
      error(err, r.value, this.showError);
    }
  }

  format() {
    const p = this.props as any;
    const diffModel = p['diffModel'];
    if (diffModel) {
      const differentKeys = diff(diffModel.origin, diffModel.value);
      const dataFields = getDataFields(this.form);
      dataFields.forEach(e => {
        if (differentKeys.indexOf(e.getAttribute('data-field')) >= 0) {
          if (e.childNodes.length === 3) {
            (e.childNodes[1] as HTMLElement).classList.add('highlight');
            (e.childNodes[2] as HTMLElement).classList.add('highlight');
          } else {
            e.classList.add('highlight');
          }
        }
      });
    } else {
      const { origin, value } = this.state;
      const differentKeys = diff(origin, value);
      const dataFields = getDataFields(this.form);
      dataFields.forEach(e => {
        if (differentKeys.indexOf(e.getAttribute('data-field')) >= 0) {
          if (e.childNodes.length === 3) {
            (e.childNodes[1] as HTMLElement).classList.add('highlight');
            (e.childNodes[2] as HTMLElement).classList.add('highlight');
          } else {
            e.classList.add('highlight');
          }
        }
      });
    }
  }

  protected handleNotFound() {
    this.setState({ disabled: true });
    const msg = message(this.resourceService.value, 'error_not_found', 'error');
    this.showError(msg.message, msg.title);
  }
}

export function formatDiffModel<T, ID>(obj: DiffModel<T, ID>, formatFields?: (obj3: T) => T): DiffModel<T, ID> {
  if (!obj) {
    return obj;
  }
  const obj2 = clone(obj);
  if (!obj2.origin) {
    obj2.origin = {};
  } else {
    if (typeof obj2.origin === 'string') {
      obj2.origin = JSON.parse(obj2.origin);
    }
    if (formatFields && typeof obj2.origin === 'object' && !Array.isArray(obj2.origin)) {
      obj2.origin = formatFields(obj2.origin);
    }
  }
  if (!obj2.value) {
    obj2.value = {};
  } else {
    if (typeof obj2.value === 'string') {
      obj2.value = JSON.parse(obj2.value);
    }
    if (formatFields && typeof obj2.value === 'object' && !Array.isArray(obj2.value)) {
      obj2.value = formatFields(obj2.value);
    }
  }
  return obj2;
}

export interface DiffModel<T, ID> {
  id?: ID;
  origin?: T;
  value: T;
}
export interface ApprService<ID> {
  approve(id: ID, ctx?: any): Promise<number|string>;
  reject(id: ID, ctx?: any): Promise<number|string>;
}
export interface DiffService<T, ID> {
  keys(): string[];
  diff(id: ID, ctx?: any): Promise<DiffModel<T, ID>>;
}
export interface DiffApprService<T, ID> extends DiffService<T, ID>, ApprService<ID> {
}

export interface DiffState<T> {
  origin: T;
  value: T;
  disabled: boolean;
}

export class DiffApprComponent<T, ID, P extends HistoryProps, S extends DiffState<T>> extends BaseDiffApprComponent<T, ID, P, S> {
  constructor(props: P, protected service: DiffApprService<T, ID>,
      param: ResourceService|DiffParameter,
      showMessage?: (msg: string, option?: string) => void,
      showError?: (m: string, title?: string, detail?: string, callback?: () => void) => void,
      loading?: LoadingService,
      status?: DiffStatusConfig) {
    super(props, service.keys(), getResource(param), getMsgFunc(param, showMessage), getErrorFunc(param, showError), getLoadingFunc(param, loading), getDiffStatusFunc(param, status));
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
    this.formatFields = this.formatFields.bind(this);
    this.ref = React.createRef();
    this.state = {
      origin: this.initModel(),
      value: this.initModel(),
      disabled: false,
    };
  }
  protected ref: any;

  componentDidMount() {
    this.form = this.ref.current;
    const id = buildId<ID>(this.props, this.keys);
    this.load(id);
  }

  formatFields(value: T): T {
    return value;
  }

  async load(_id: ID) {
    const id: any = _id;
    if (id != null && id !== '') {
      this.id = _id;
      try {
        this.running = true;
        if (this.loading) {
          this.loading.showLoading();
        }
        const dobj = await this.service.diff(id);
        if (!dobj) {
          this.handleNotFound();
        } else {
          const formatdDiff = formatDiffModel(dobj, this.formatFields);
          this.setState({
            origin: formatdDiff.origin,
            value: formatdDiff.value
          }, this.format);
        }
      } catch (err) {
        const data = (err &&  err.response) ? err.response : err;
        if (data && data.status === 404) {
          this.handleNotFound();
        } else {
          error(err, this.resourceService.value, this.showError);
        }
      } finally {
        this.running = false;
        if (this.loading) {
          this.loading.hideLoading();
        }
      }
    }
  }

  async approve(event: any) {
    event.preventDefault();
    try {
      this.running = true;
      if (this.loading) {
        this.loading.showLoading();
      }
      const id = this.id;
      const status = await this.service.approve(id);
      this.postApprove(status, null);
    } catch (err) {
      this.postApprove(4, err);
    } finally {
      this.running = false;
      if (this.loading) {
        this.loading.hideLoading();
      }
    }
  }

  async reject(event: any) {
    event.preventDefault();
    try {
      this.running = true;
      if (this.loading) {
        this.loading.showLoading();
      }
      const id = this.id;
      const status = await this.service.reject(id);
      this.postReject(status, null);
    } catch (err) {
      this.postReject(4, err);
    } finally {
      this.running = false;
      if (this.loading) {
        this.loading.hideLoading();
      }
    }
  }
}
export function getDataFields(form: HTMLElement): HTMLElement[] {
  let results: HTMLElement[] = [];
  const attributeValue = form.getAttribute('data-field');
  if (attributeValue && attributeValue.length > 0) {
    results.push(form);
  }
  const childNodes = form.childNodes;
  if (childNodes.length > 0) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i] as HTMLElement;
      if (childNode.nodeType === Node.ELEMENT_NODE) {
        results = results.concat(getDataFields(childNode));
      }
    }
  }
  return results;
}
