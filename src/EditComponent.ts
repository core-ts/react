import * as React from 'react';
import {clone} from 'reflectx';
import {initForm, initMaterial, storage} from 'uione';
import {BaseEditComponent} from './BaseEditComponent';
import {buildId, Metadata} from './core';
import {ResultInfo} from './edit';
import {HistoryProps} from './HistoryProps';

export interface ViewService<T, ID> {
  metadata(): Metadata;
  keys(): string[];
  load(id: ID): Promise<T>;
}

export interface GenericService<T, ID, R> extends ViewService<T, ID> {
  patch(obj: T): Promise<R>;
  insert(obj: T): Promise<R>;
  update(obj: T): Promise<R>;
  delete?(id: ID): Promise<number>;
}

export class EditComponent<T, ID, W extends HistoryProps, I> extends BaseEditComponent<T, W, I>  {
  constructor(props, protected service: GenericService<T, ID, number|ResultInfo<T>>, patchable?: boolean, backOnSaveSuccess?: boolean) {
    super(props, service.metadata(), patchable, backOnSaveSuccess);
    this.load = this.load.bind(this);
    this.save = this.save.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.ref = React.createRef();
  }
  protected ref: any;
  componentDidMount() {
    this.form = initForm(this.ref.current, initMaterial);
    const id = buildId<ID>(this.keys, this.props);
    this.load(id);
  }
  async load(_id: ID) {
    const id: any = _id;
    const com = this;
    if (id != null && id !== '') {
      try {
        const obj = await this.service.load(id);
        if (!obj) {
          com.handleNotFound(com.form);
        } else {
          com.resetState(false, obj, clone(obj));
        }
      } catch (err) {
        if (err && err.status === 404) {
          com.handleNotFound(com.form);
        } else {
          com.handleError(err);
        }
      } finally {
        com.running = false;
        storage.loading().hideLoading();
      }
    } else {
      // Call service state
      const obj = this.createModel();
      this.resetState(true, obj, null);
    }
  }
  protected async save(obj: T, body?: T, isBack?: boolean) {
    this.running = true;
    storage.loading().showLoading();
    const isBackO = (isBack == null || isBack === undefined ? this.backOnSuccess : isBack);
    const com = this;
    if (this.newMode === false) {
      if (this.patchable === true && body && Object.keys(body).length > 0) {
        /*
        if (this.versionName && this.versionName.length > 0) {
          body[this.versionName] = obj[this.versionName];
        }
        */
        const result = await this.service.patch(body);
        com.postSave(result, isBackO);
      } else {
        const result = await this.service.update(obj);
        com.postSave(result, isBackO);
      }
    } else {
      const result = await this.service.insert(obj);
      com.postSave(result, isBackO);
    }
  }
}
