import {getDataFields} from 'form-util';
import * as React from 'react';
import {clone, diff} from 'reflectx';
import {messageByHttpStatus, storage} from 'uione';
import {message} from 'uione';
import {buildKeys, Metadata} from './core';
import {HistoryProps} from './HistoryProps';

export enum Status {
  NotFound = 0,
  Success = 1,
  VersionError = 2,
  Error = 4,
}

export interface BaseDiffState {
  disabled: boolean;
}

export interface DiffModel<T, ID> {
  id?: ID;
  origin?: T;
  value: T;
}

export class BaseDiffApprComponent<T, ID, W extends HistoryProps, I extends BaseDiffState> extends React.Component<W, I & any> {
  constructor(props, protected metadata: Metadata) {
    super(props);
    // this._id = props['props'].match.params.id || props['props'].match.params.cId || props.match.params.cId;
    // this.callBackAfterUpdate = this.callBackAfterUpdate.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.alertError = this.alertError.bind(this);
    this.back = this.back.bind(this);
    this.initModel = this.initModel.bind(this);
    this.postApprove = this.postApprove.bind(this);
    this.postReject = this.postReject.bind(this);
    this.format = this.format.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleNotFound = this.handleNotFound.bind(this);
    this.keys = buildKeys(metadata);
    this.state = {
      disabled: false
    };
  }
  protected keys: string[];
  protected id: ID = null;
  protected form: any;
  protected running: boolean;
  protected resource: any = storage.getResource();

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

  protected postApprove(status: Status, err?: any) {
    this.setState({ disabled: true });
    const r = storage.resource();
    if (status === Status.Success) {
      this.showMessage(r.value('msg_approve_success'));
    } else if (status === Status.VersionError) {
      const msg = message(storage.resource(), 'msg_approve_version_error', 'error');
      this.alertError(msg.message, msg.title);
    } else if (status === Status.NotFound) {
      this.handleNotFound();
    } else {
      this.handleError(err);
    }
  }

  protected postReject(status: Status, err?: any) {
    this.setState({ disabled: true });
    const r = storage.resource();
    if (status === Status.Success) {
      this.showMessage(r.value('msg_reject_success'));
    } else if (status === Status.VersionError) {
      const msg = message(storage.resource(), 'msg_approve_version_error', 'error');
      this.alertError(msg.message, msg.title);
    } else if (status === Status.NotFound) {
      this.handleNotFound();
    } else {
      this.handleError(err);
    }
  }
  protected showMessage(msg: string) {
    storage.toast().showToast(msg);
  }
  protected alertError(msg: string, title: string) {
    storage.alert().alertError(msg, title);
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
            e.childNodes[1].classList.add('highlight');
            e.childNodes[2].classList.add('highlight');
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
            e.childNodes[1].classList.add('highlight');
            e.childNodes[2].classList.add('highlight');
          } else {
            e.classList.add('highlight');
          }
        }
      });
    }
  }

  protected handleNotFound() {
    this.setState({ disabled: true });
    const msg = message(storage.resource(), 'error_not_found', 'error');
    this.alertError(msg.message, msg.title);
  }
  handleError(err: any): void {
    const r = storage.resource();
    let msg = r.value('error_internal');
    if (err) {
      if (err.status && !isNaN(err.status)) {
        msg = messageByHttpStatus(err.status, r);
      }
    }
    const title = r.value('error');
    this.alertError(msg, title);
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
