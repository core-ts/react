import {readOnly} from 'form-util';
import {message, storage} from 'uione';
import {BaseViewComponent} from './BaseViewComponent';
import {Metadata} from './core';
import {HistoryProps} from './HistoryProps';

export interface ViewService<T, ID> {
  metadata(): Metadata;
  keys(): string[];
  load(id: ID, ctx?: any): Promise<T>;
}

export class ViewComponent<T, ID, W extends HistoryProps, I> extends BaseViewComponent<W, I> {
  constructor(props, protected metadata: Metadata, private viewService: ViewService<T, ID>) {
    super(props);
    this.getModelName = this.getModelName.bind(this);
    this.load = this.load.bind(this);
    this.getModel = this.getModel.bind(this);
    this.showModel = this.showModel.bind(this);
  }
  protected form: any;

  protected getModelName() {
    return (this.metadata ? this.metadata.name : '');
  }

  async load(_id: ID) {
    const id: any = _id;
    if (id != null && id !== '') {
      this.running = true;
      storage.loading().showLoading();
      try {
        const obj = await this.viewService.load(id);
        if (!obj) {
          this.handleNotFound(this.form);
        } else {
          this.showModel(obj);
        }
      } catch (err) {
        if (err && err.status === 404) {
          this.handleNotFound(this.form);
        } else {
          this.handleError(err);
        }
      } finally {
        this.running = false;
        storage.loading().hideLoading();
      }
    }
  }
  protected handleNotFound(form?: any): void {
    const msg = message(storage.resource(), 'error_not_found', 'error');
    if (this.form) {
      readOnly(this.form);
    }
    this.alertError(msg.message, msg.title);
  }
  getModel(): T {
    return this.state[this.getModelName()];
  }
  showModel(model: T) {
    const modelName = this.getModelName();
    const objSet: any = {};
    objSet[modelName] = model;
    this.setState(objSet);
  }
}
