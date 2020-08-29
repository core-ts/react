import * as React from 'react';
import {Locale, messageByHttpStatus} from 'uione';
import {storage} from 'uione';
import {HistoryProps} from './HistoryProps';

export class BaseViewComponent<W extends HistoryProps, I> extends React.Component<W, I & any> {
  constructor(props) {
    super(props);
    this.requireAuthentication = this.requireAuthentication.bind(this);
    this.getLocale = this.getLocale.bind(this);
    this.back = this.back.bind(this);
    this.alertError = this.alertError.bind(this);

    this.handleError = this.handleError.bind(this);
  }

  private _includingCurrencySymbol = false;
  protected resource: any = storage.getResource();
  protected dateTimeFormat: string = null;
  protected running: boolean;
  protected form: any;

  protected includingCurrencySymbol(): boolean {
    return this._includingCurrencySymbol;
  }

  protected getCurrencyCode(): string {
    return (this.form ? this.form.getAttribute('currency-code') : null);
  }

  protected getLocale(): Locale {
    return storage.getLocale();
  }

/*
  protected formatDateTime(date: Date): string {
    if (!date) {
      return '';
    }
    if (this.dateTimeFormat == null) {
      this.initDateFormat();
    }
    return moment(date).format(this.dateTimeFormat);
  }

  protected formatDate(date: Date, format?: string, locale?: string): string {
    if (format) {
      return moment(date).format(format); // DateUtil.formatDate(date, format);
    } else {
      moment(date).format(this.getLocale().dateFormat.toUpperCase());
    }
  }
*/
  protected back(event) {
    if (event) {
      event.preventDefault();
    }
    this.props.history.goBack();
  }

  handleError(err?: any) {
    storage.loading().hideLoading();
    this.running = false;
    // const data = response && response.response && response.response.data ? response.response.data : response;
    const data = err.response ? err.response : err;
    const descriptions = [];
    const errCodeList = [];
    let callBack = null;
    const r = storage.resource();
    const title = r.value('error');
    let msg = r.value('error_internal');
    if (data && data.status) {
      if (data.status === 404) {
        msg = r.value('error_not_found');
        errCodeList.push(data.statusText);
        descriptions.push(msg);
        const errCode = this.returnErrCodeIfExist(errCodeList, 'InvalidAuthorizationToken');
        callBack = this.makeCallBackHandleError(errCode);

        this.alertError(descriptions.join('<br>'), title, null, callBack);
      } else if (data.status === 401) {
        msg = r.value('error_unauthorized');
        errCodeList.push('InvalidAuthorizationToken');
        descriptions.push(msg);
        const errCode = this.returnErrCodeIfExist(errCodeList, 'InvalidAuthorizationToken');
        callBack = this.makeCallBackHandleError(errCode);

        this.alertError(descriptions.join('<br>'), title, null, callBack);
      } else if (data.status === 403) {
        msg = r.value('error_forbidden');
        errCodeList.push('Forbidden');
        descriptions.push(msg);
        const errCode = this.returnErrCodeIfExist(errCodeList, 'InvalidAuthorizationToken');
        callBack = this.makeCallBackHandleError(errCode);

        this.alertError(descriptions.join('<br>'), title, null, callBack);
      } else {
        msg = messageByHttpStatus(data.status, r);
        this.alertError(msg, title, null, callBack);
      }
    } else {
      this.alertError(msg, title, null, callBack);
    }
  }
  private makeCallBackHandleError(errCode: string): any {
    switch (errCode) {
      case 'InvalidAuthorizationToken': {
        return  this.requireAuthentication();
      }
    }
  }
  protected alertError(msg: string, title: string, detail?: string, callback?: () => void) {
    storage.alert().alertError(msg, title, detail, callback);
  }
  private requireAuthentication() {
    sessionStorage.clear();
    const redirect = window.location.pathname;
    this.props.history.push('/auth?redirect=' + redirect);
  }

  private returnErrCodeIfExist(arrayErrCode: string[], expected: string): string {
    return arrayErrCode.find(errCode => errCode === expected);
  }
}
