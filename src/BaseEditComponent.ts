import {focusFirstError, readOnly} from 'form-util';
import {clone, makeDiff} from 'reflectx';
import {message} from 'uione';
import {storage} from 'uione';
import {UIService} from 'uione';
import {BaseComponent} from './BaseComponent';
import {Metadata} from './core';
import {build, buildMessageFromStatusCode, createModel, handleVersion, initPropertyNullInModel, ResultInfo, Status} from './edit';
import {HistoryProps} from './HistoryProps';

export abstract class BaseEditComponent<T, W extends HistoryProps, I> extends BaseComponent<W, I> {
  constructor(props, protected metadata: Metadata, patchable?: boolean, backOnSaveSuccess?: boolean) {
    super(props);
    const meta = build(metadata);
    this.keys = meta.keys;
    this.version = meta.version;
    this.ui = storage.ui();

    this.showMessage = this.showMessage.bind(this);
    this.confirm = this.confirm.bind(this);

    this.resetState = this.resetState.bind(this);
    this.handleNotFound = this.handleNotFound.bind(this);
    this.getModelName = this.getModelName.bind(this);
    this.getModel = this.getModel.bind(this);
    this.showModel = this.showModel.bind(this);
    this.createModel = this.createModel.bind(this);
    this.newOnClick = this.newOnClick.bind(this);
    this.saveOnClick = this.saveOnClick.bind(this);
    this.onSave = this.onSave.bind(this);
    this.validate = this.validate.bind(this);
    this.save = this.save.bind(this);
    this.succeed = this.succeed.bind(this);
    this.fail = this.fail.bind(this);
    this.postSave = this.postSave.bind(this);
    this.handleDuplicateKey = this.handleDuplicateKey.bind(this);
    if (patchable === false) {
      this.patchable = patchable;
    }
    if (backOnSaveSuccess === false) {
      this.backOnSuccess = backOnSaveSuccess;
    }
    const r = storage.resource();
    this.insertSuccessMsg = r.value('msg_save_success');
    this.updateSuccessMsg = r.value('msg_save_success');
  }
  backOnSuccess = true;
  protected keys: string[];
  protected version?: string;
  protected ui: UIService;
  protected newMode = false;
  protected setBack = false;
  protected patchable = true;
  protected orginalModel: T;

  protected addable: boolean = true;
  protected editable: boolean = true;

  insertSuccessMsg: string;
  updateSuccessMsg: string;

  protected resetState(newMod: boolean, model: T, originalModel: T) {
    this.newMode = newMod;
    this.orginalModel = originalModel;
    this.showModel(model);
  }
  protected handleNotFound(form?: any): void {
    const msg = message(storage.resource(), 'error_not_found', 'error');
    if (form) {
      readOnly(form);
    }
    this.alertError(msg.message, msg.title);
  }
  protected getModelName() {
    return this.metadata.name;
  }
  getModel(): T {
    return this.props[this.getModelName()] || this.state[this.getModelName()];
  }
  showModel(model: T) {
    const f = this.form;
    const modelName = this.getModelName();
    const objSet: any = {};
    objSet[modelName] = model;
    this.setState(objSet, () => {
      if (this.editable === false) {
        readOnly(f);
      }
    });
  }

  // end of: can be in ViewComponent
  protected createModel(): T {
    if (this.metadata) {
      const obj = createModel(this.metadata);
      return obj;
    } else {
      const obj: any = {};
      return obj;
    }
  }

  newOnClick = (event: any) => {
    if (event) {
      event.preventDefault();
    }
    if (!this.form && event && event.target && event.target.form) {
      this.form = event.target.form;
    }
    const obj = this.createModel();
    this.resetState(true, obj, null);
    const u = this.ui;
    const f = this.form;
    setTimeout(() => {
      u.removeFormError(f);
    }, 100);
  }
  protected saveOnClick = (event: any) => {
    event.preventDefault();
    event.persist();
    if (!this.form && event && event.target) {
      this.form = event.target.form;
    }
    this.onSave(this.backOnSuccess);
  }
  onSave(isBack?: boolean) {
    const r = storage.resource();
    if (this.newMode === true && this.addable === false) {
      const m = message(r, 'error_permission_add', 'error_permission');
      this.alertError(m.message, m.title);
      return;
    } else if (this.newMode === false && this.editable === false) {
      const msg = message(r, 'error_permission_edit', 'error_permission');
      this.alertError(msg.message, msg.title);
      return;
    } else {
      if (this.running === true) {
        return;
      }
      const com = this;
      const obj = com.getModel();
      if (this.newMode) {
        com.validate(obj, () => {
          const msg = message(r, 'msg_confirm_save', 'confirm', 'yes', 'no');
          this.confirm(msg.message, msg.title, () => {
            com.save(obj, null, isBack);
          }, msg.no, msg.yes);
        });
      } else {
        const diffObj = makeDiff(initPropertyNullInModel(this.orginalModel, this.metadata), obj, this.keys, this.version);
        const keys = Object.keys(diffObj);
        if (keys.length === 0) {
          this.showMessage(r.value('msg_no_change'));
        } else {
          com.validate(obj, () => {
            const msg = message(r, 'msg_confirm_save', 'confirm', 'yes', 'no');
            this.confirm(msg.message, msg.title, () => {
              com.save(obj, diffObj, isBack);
            }, msg.no, msg.yes);
          });
        }
      }
    }
  }
  protected confirm(msg: string, title: string, yesCallback?: () => void, btnLeftText?: string, btnRightText?: string, noCallback?: () => void) {
    storage.alert().confirm(msg, title, yesCallback, btnLeftText, btnRightText, noCallback);
  }
  protected validate(obj: T, callback: (obj2?: T) => void) {
    const valid = this.ui.validateForm(this.form, this.getLocale());
    if (valid) {
      callback(obj);
    }
  }

  protected save(obj: T, diff?: T, isBack?: boolean) {
  }

  protected succeed(msg: string, isBack?: boolean, result?: ResultInfo<T>) {
    if (result) {
      const model = result.value;
      this.newMode = false;
      if (model && this.setBack === true) {
        this.resetState(false, model, clone(model));
      } else {
        handleVersion(this.getModel(), this.version);
      }
    } else {
      handleVersion(this.getModel(), this.version);
    }
    const isBackO = (isBack == null || isBack === undefined ? this.backOnSuccess : isBack);
    this.showMessage(msg);
    if (isBackO) {
      this.back(null);
    }
  }
  protected showMessage(msg: string) {
    storage.toast().showToast(msg);
  }
  protected fail(result: ResultInfo<T>) {
    const errors = result.errors;
    const f = this.form;
    const unmappedErrors = this.ui.showFormError(f, errors);
    focusFirstError(f);
    if (!result.message) {
      if (errors && errors.length === 1) {
        result.message = errors[0].message;
      } else {
        result.message = this.ui.buildErrorMessage(unmappedErrors);
      }
    }
    const t = this.resource['error'];
    this.alertError(result.message, t);
  }

  protected postSave(res: number|ResultInfo<T>, backOnSave?: boolean) {
    this.running = false;
    storage.loading().hideLoading();
    const newMod = this.newMode;
    const successMsg = (newMod ? this.insertSuccessMsg : this.updateSuccessMsg);
    const x: any = res;
    if (!isNaN(x)) {
      if (x > 0) {
        this.succeed(successMsg, backOnSave);
      } else {
        if (newMod) {
          this.handleDuplicateKey();
        } else {
          this.handleNotFound();
        }
      }
    } else {
      const result: ResultInfo<T> = x;
      if (result.status === Status.Success) {
        this.succeed(successMsg, backOnSave, result);
        this.showMessage(successMsg);
      } else if (result.status === Status.Error) {
        this.fail(result);
      } else if (result.status === Status.DuplicateKey) {
        this.handleDuplicateKey(result);
      } else {
        const r = storage.resource();
        const msg = buildMessageFromStatusCode(result.status, r);
        const title = r.value('error');
        if (msg && msg.length > 0) {
          this.alertError(msg, title);
        } else if (result.message && result.message.length > 0) {
          this.alertError(result.message, title);
        } else {
          this.alertError(r.value('error_internal'), title);
        }
      }
    }
  }

  protected handleDuplicateKey(result?: ResultInfo<T>) {
    const msg = message(storage.resource(), 'error_duplicate_key', 'error');
    this.alertError(msg.message, msg.title);
  }
}
