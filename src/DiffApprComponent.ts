import * as React from 'react';
import {storage} from 'uione';
import {BaseDiffApprComponent, formatDiffModel, Status} from './BaseDiffApprComponent';
import {buildId, Metadata} from './core';
import {HistoryProps} from './HistoryProps';

export interface DiffModel<T, ID> {
  id?: ID;
  origin?: T;
  value: T;
}
export interface ApprService<ID> {
  approve(id: ID, ctx?: any): Promise<Status>;
  reject(id: ID, ctx?: any): Promise<Status>;
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

export class DiffApprComponent<T, ID, W extends HistoryProps, I extends DiffState<T>> extends BaseDiffApprComponent<T, ID, W, I> {
  constructor(props, metadata: Metadata, protected service: DiffApprService<T, ID>) {
    super(props, metadata);
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
    const id = buildId<ID>(this.keys, this.props);
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
        if (err && err.status === 404) {
          this.handleNotFound();
        } else {
          this.handleError(err);
        }
        this.handleError(err);
      } finally {
        this.running = false;
        storage.loading().hideLoading();
      }
    }
  }

  async approve(event: any) {
    event.preventDefault();
    try {
      const id = this.id;
      const status = await this.service.approve(id);
      this.postApprove(status, null);
    } catch (err) {
      this.postApprove(Status.Error, err);
    }
  }

  async reject(event: any) {
    event.preventDefault();
    try {
      const id = this.id;
      const status = await this.service.reject(id);
      this.postReject(status, null);
    } catch (err) {
      this.postReject(Status.Error, err);
    }
  }
}
