import {focusFirstError, readOnly} from 'form-util';
import * as React from 'react';
import {setValue} from 'reflectx';
import {clone, makeDiff} from 'reflectx';
import {addParametersIntoUrl, append, buildSearchMessage, changePage, changePageSize, formatResults, getDisplayFields, handleSortEvent, initSearchable, mergeSearchModel, more, optimizeSearchModel, reset, Searchable, SearchModel, SearchResult, showResults} from 'search-utilities';
import {formatter} from 'ui-plus';
import {Locale, messageByHttpStatus} from 'uione';
import {storage} from 'uione';
import {UIService} from 'uione';
import {message} from 'uione';
import {initForm, initMaterial} from 'uione';
import {buildId, Metadata} from './core';
import {build, buildMessageFromStatusCode, createModel, handleVersion, initPropertyNullInModel, ResultInfo, Status} from './edit';
import {HistoryProps} from './HistoryProps';
import {buildFromUrl} from './route';
import {valueOf} from './util';

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

export class BaseComponent<W extends HistoryProps, I> extends BaseViewComponent<W, I> {
  constructor(props) {
    super(props);
    this.uiS1 = storage.ui();
    this.updateState = this.updateState.bind(this);
    this.updateFlatState = this.updateFlatState.bind(this);
    this.updatePhoneState = this.updatePhoneState.bind(this);
    this.updateDateState = this.updateDateState.bind(this);
    this.prepareCustomData = this.prepareCustomData.bind(this);
  }
  private uiS1: UIService;
  /*
  protected handleSubmitForm(e) {
    if (e.which === 13) {
      if (document.getElementById('sysAlert').style.display !== 'none') {
        document.getElementById('sysYes').click();
      } else {
        document.getElementById('btnSave').click();
      }
    } else if (e.which === 27) {
      document.getElementById('sysNo').click();
    }
  }
*/
  protected scrollToFocus = (e: any, isUseTimeOut = false) => {
    try {
      const element = e.target;
      const container = e.target.form.childNodes[1];
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const middle = absoluteElementTop - (window.innerHeight / 2);
      const scrollTop = container.scrollTop;
      const timeOut = isUseTimeOut ? 300 : 0;
      const isChrome = navigator.userAgent.search('Chrome') > 0;
      setTimeout(() => {
        if (isChrome) {
          const scrollPosition = scrollTop === 0 ? (elementRect.top + 64) : (scrollTop + middle);
          container.scrollTo(0, Math.abs(scrollPosition));
        } else {
          container.scrollTo(0, Math.abs(scrollTop + middle));
        }
      }, timeOut);
    } catch (e) {
      console.log(e);
    }
  }

  prepareCustomData(data) { }

  protected updatePhoneState = (event) => {
    const re = /^[0-9\b]+$/;
    const value = formatter.removePhoneFormat(event.currentTarget.value);
    if (re.test(value) || !value) {
      this.updateState(event);
    } else {
      const splitArr = value.split('');
      let responseStr = '';
      splitArr.forEach(element => {
        if (re.test(element)) {
          responseStr += element;
        }
      });
      event.currentTarget.value = responseStr;
      this.updateState(event);
    }
  }

  protected updateDateState = (name, value) => {
    const props: any = this.props;
    const modelName = this.form.getAttribute('model-name');
    const state = this.state[modelName];
    if (props.setGlobalState) {
      const data = props.shouldBeCustomized ? this.prepareCustomData({ [name]: value }) : { [name]: value };
      props.setGlobalState({ [modelName]: { ...state, ...data } });
    } else {
      this.setState({[modelName]: {...state, [name]: value}});
    }
  }

  protected updateState = (e: any, callback?: any, locale?: Locale) => {
    const props: any = this.props;
    const ctrl = e.currentTarget;
    const updateStateMethod = props.setGlobalState;
    const modelName = ctrl.form.getAttribute('model-name');
    const propsDataForm = props[modelName];
    const type = ctrl.getAttribute('type');
    const isPreventDefault = type && (['checkbox', 'radio'].indexOf(type.toLowerCase()) >= 0 ? false : true);
    if (isPreventDefault) {
      e.preventDefault();
    }
    if (
      ctrl.nodeName === 'SELECT' &&
      ctrl.value &&
      ctrl.classList.contains('invalid')) {
      this.uiS1.removeErrorMessage(ctrl);
    }
    if (updateStateMethod) {
      const form = ctrl.form;
      const formName = form.name;
      if (!locale) {
        locale = this.getLocale();
      }
      const res = valueOf(ctrl, locale, e.type);
      if (res.mustChange) {
        const dataField = ctrl.getAttribute('data-field');
        const field = (dataField ? dataField : ctrl.name);
        if (field.indexOf('.') < 0 && field.indexOf('[') < 0) {
          const data = props.shouldBeCustomized ? this.prepareCustomData({ [ctrl.name]: res.value }) : { [ctrl.name]: res.value };
          props.setGlobalState({ [formName]: { ...propsDataForm, ...data } });
        } else {
          setValue(propsDataForm, field, ctrl.value);
          props.setGlobalState({ [formName]: { ...propsDataForm } });
        }
      }
    } else {
      const form = ctrl.form;
      if (form) {
        if (modelName && modelName !== '') {
          const ex = this.state[modelName];
          const dataField = ctrl.getAttribute('data-field');
          const field = (dataField ? dataField : ctrl.name);
          const model = Object.assign({}, ex);
          if (type && type.toLowerCase() === 'checkbox') {
            const ctrlOnValue = ctrl.getAttribute('data-on-value');
            const ctrlOffValue = ctrl.getAttribute('data-off-value');
            const onValue = ctrlOnValue ? ctrlOnValue : true;
            const offValue = ctrlOffValue ? ctrlOffValue : false;

            model[field] = ctrl.checked ? onValue : offValue;
            const objSet = {};
            objSet[modelName] = model;
            if (callback) {
              this.setState(objSet, callback);
            } else {
              this.setState(objSet);
            }
          } else if (type && type.toLowerCase() === 'radio') {
            if (field.indexOf('.') < 0 && field.indexOf('[') < 0 ) {
              model[field] = ctrl.value;
            } else {
              setValue(model, field, ctrl.value);
            }
            const objSet = {};
            objSet[modelName] = model;
            if (callback) {
              this.setState(objSet, callback);
            } else {
              this.setState(objSet);
            }
          } else {
            const tloc = (!locale ? this.getLocale() : locale);
            const data = valueOf(ctrl, tloc, e.type);

            if (data.mustChange) {
              if (field.indexOf('.') < 0 && field.indexOf('[') < 0) {
                model[field] = data.value;
              } else {
                setValue(model, field, data.value);
              }
              const objSet = {};
              objSet[modelName] = model;
              if (callback) {
                this.setState(objSet, callback);
              } else {
                this.setState(objSet);
              }
            }
          }
        } else {
          this.updateFlatState(e, callback);
        }
      } else {
        this.updateFlatState(e, callback);
      }
    }
  }

  private updateFlatState(e: any, callback?: () => void, locale?: Locale) {
    const ctrl = e.currentTarget;
    const stateName = ctrl.name;
    const objSet = {};
    const type = ctrl.getAttribute('type');
    if (type && type.toLowerCase() === 'checkbox') {
      if (ctrl.id && stateName === ctrl.id) {
        const origin = this.state[stateName];
        objSet[stateName] = (origin ? !origin : true);
        this.setState(objSet);
      } else {
        let value = this.state[stateName];
        value.includes(ctrl.value) ? value = value.filter(v => v !== ctrl.value) : value.push(ctrl.value);
        this.setState({ [ctrl.name]: value });
      }
    } else {
      const tloc = (!locale ? this.getLocale() : locale);
      const data = valueOf(ctrl, tloc, e.type);
      if (data.mustChange) {
        objSet[stateName] = data.value;
        if (callback) {
          this.setState(objSet, callback);
        } else {
          this.setState(objSet);
        }
      }
    }
  }
}


export interface LocaleFormatter<T> {
  format(obj: T, locale: Locale): T;
}

export class BaseSearchComponent<T, S extends SearchModel, W extends HistoryProps, I extends SearchState<T>> extends BaseComponent<W, I> implements Searchable {
  constructor(props, protected listFormId?: string) {
    super(props);
    this.ui = storage.ui();
    this.showMessage = this.showMessage.bind(this);
    this.getSearchForm = this.getSearchForm.bind(this);
    this.setSearchForm = this.setSearchForm.bind(this);
    this.mergeSearchModel = this.mergeSearchModel.bind(this);
    this.load = this.load.bind(this);
    this.add = this.add.bind(this);
    this.searchOnClick = this.searchOnClick.bind(this);
    this.sort = this.sort.bind(this);
    this.showMore = this.showMore.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.pageChanged = this.pageChanged.bind(this);
    this.pageSizeChanged = this.pageSizeChanged.bind(this);
    this.clearKeyworkOnClick = this.clearKeyworkOnClick.bind(this);
    this.mergeUrlSearchModel = this.mergeUrlSearchModel.bind(this);
    this.showResults = this.showResults.bind(this);
    this.searchError = this.searchError.bind(this);
    this.getDisplayFields = this.getDisplayFields.bind(this);
    this.url = (props.match ? props.match.url : props['props'].match.url);
    /*
    this.locationSearch = '';
    const location = (props.location ? props.location : props['props'].location);
    if (location && location.search) {
      this.locationSearch = location.search;
    }
    */
  }
  protected url: string;
  protected ui: UIService;

  // Pagination
  initPageSize = 20;
  pageSize = 20;
  pageIndex = 1;
  itemTotal: number;
  pageTotal: number;
  showPaging = false;
  append = false;
  appendMode = false;
  appendable = false;

  // Sortable
  sortField: string;
  sortType: string;
  sortTarget: any; // HTML element

  formatter: LocaleFormatter<T>;
  displayFields: string[];
  initDisplayFields = false;
  sequenceNo = 'sequenceNo';
  triggerSearch = false;
  tmpPageIndex: number;

  pageMaxSize = 7;
  pageSizes: number[] = [10, 20, 40, 60, 100, 200, 400, 800];

  private list: T[];
  excluding: any;
  hideFilter: boolean;

  ignoreUrlParam = false;
  // locationSearch: string;
  // _currentSortField: string;

  viewable: boolean;
  addable: boolean;
  editable: boolean;
  deletable: boolean;
  approvable: boolean;

  protected mergeUrlSearchModel(searchModel: any): void {
    for (const key of Object.keys(searchModel)) {
      if (searchModel[key] !== '') {
        searchModel[key] = Array.isArray(this.state[key]) ? searchModel[key].split(',') : searchModel[key];
      } else {
        searchModel[key] = Array.isArray(this.state[key]) ? [] : searchModel[key];
      }
    }
    this.setState(searchModel);
  }

  toggleFilter(event: any): void {
    this.hideFilter = !this.hideFilter;
  }
  protected showMessage(msg: string) {
    storage.toast().showToast(msg);
  }
  protected add = (event) => {
    event.preventDefault();
    const url = this.props['props'].match.url + '/add';
    this.props.history.push(url);
  }
  mergeSearchModel(obj: any, arrs?: string[]|any, b?: S): S {
    return mergeSearchModel(obj, this.pageSizes, arrs, b);
  }
  load(s: S, autoSearch: boolean): void {
    /*
    if (!this.ignoreUrlParam) {
      const parsed = qs.parse(this.locationSearch);
      const searchModel = initSearchable(parsed, this);
      this.mergeUrlSearchModel(searchModel);
    }
    const com = this;
    if (com.autoSearch) {
      setTimeout(() => {
        com.doSearch(true);
      }, 100);
    }
    */
    const obj2 = initSearchable(s, this);
    this.setSearchModel(obj2);
    const com = this;
    if (autoSearch) {
      setTimeout(() => {
        com.doSearch(true);
      }, 0);
    }
  }

  protected setSearchForm(form: any): void {
    this.form = form;
  }

  protected getSearchForm(): any {
    if (!this.form && this.listFormId) {
      this.form = document.getElementById(this.listFormId);
    }
    return this.form;
  }
  setSearchModel(searchModel: S): void {
    this.setState(searchModel);
  }
  getSearchModel(): S {
    const obj2: S = this.ui.decodeFromForm(this.getSearchForm(), this.getLocale(), this.getCurrencyCode());
    const obj: any = obj2 ? obj2 : {};
    const obj3 = optimizeSearchModel(obj, this, this.getDisplayFields());
    obj3.excluding = this.excluding;
    return obj3;
  }
  getOriginalSearchModel(): S {
    return this.state;
  }
  protected getDisplayFields(): string[] {
    if (this.displayFields) {
      return this.displayFields;
    }
    if (!this.initDisplayFields) {
      if (this.form) {
        this.displayFields = getDisplayFields(this.form);
      }
      this.initDisplayFields = true;
    }
    return this.displayFields;
  }

  protected pagingOnClick = (size, e) => {
    this.setState(prevState => ({ isPageSizeOpenDropDown: !prevState.isPageSizeOpenDropDown }));
    this.pageSizeChanged(size);
  }

  protected pageSizeOnClick = () => {
    this.setState(prevState => ({ isPageSizeOpenDropDown: !prevState.isPageSizeOpenDropDown }));
  }

  protected clearKeyworkOnClick = () => {
    this.setState({
      keyword: ''
    });
  }
  searchOnClick(event: any): void {
    event.preventDefault();
    if (event && !this.getSearchForm()) {
      this.setSearchForm(event.target.form);
    }
    this.resetAndSearch();
  }

  resetAndSearch() {
    this.pageIndex = 1;
    if (this.running === true) {
      this.triggerSearch = true;
      return;
    }
    reset(this);
    this.tmpPageIndex = 1;
    this.doSearch();
  }

  doSearch(isFirstLoad?: boolean) {
    const listForm = this.getSearchForm();
    if (listForm) {
      this.ui.removeFormError(listForm);
    }
    const s = this.getSearchModel();
    const com = this;
    this.validateSearch(s, () => {
      if (com.running === true) {
        return;
      }
      com.running = true;
      storage.loading().showLoading();
      if (this.ignoreUrlParam === false) {
        addParametersIntoUrl(s, isFirstLoad);
      }
      com.search(s);
    });
  }

  search(s: SearchModel) {

  }

  validateSearch(se: S, callback: () => void) {
    let valid = true;
    const listForm = this.getSearchForm();
    if (listForm) {
      valid = this.ui.validateForm(listForm, this.getLocale());
    }
    if (valid === true) {
      callback();
    }
  }
  protected searchError(err: any): void {
    this.pageIndex = this.tmpPageIndex;
    this.handleError(err);
  }
  showResults(s: SearchModel, sr: SearchResult<T>) {
    const com = this;
    const results = sr.results;
    if (results && results.length > 0) {
      const locale = this.getLocale();
      formatResults(results, this.formatter, locale, this.sequenceNo, this.pageIndex, this.pageSize, this.initPageSize);
    }
    const appendMode = com.appendMode;
    showResults(s, sr, com);
    if (appendMode === false) {
      com.setList(results);
      com.tmpPageIndex = s.page;
      const r = storage.resource();
      const m1 = buildSearchMessage(s, sr, r);
      this.showMessage(m1);
    } else {
      if (com.append === true && s.page > 1) {
        com.appendList(results);
      } else {
        com.setList(results);
      }
    }
    com.running = false;
    storage.loading().hideLoading();
    if (com.triggerSearch === true) {
      com.triggerSearch = false;
      com.resetAndSearch();
    }
  }

  appendList(results: T[]) {
    const list = this.state.results;
    const arr = append(list, results);

    const listForm = this.getSearchForm();
    const props: any = this.props;
    const setGlobalState = props.props.setGlobalState;
    if (setGlobalState && listForm) {
      setGlobalState({ [listForm.name]: arr });
    } else {
      this.setState({ results: arr });
    }
  }

  setList(results: T[]) {
    const props: any = this.props;
    const setGlobalState = props.props.setGlobalState;
    this.list = results;
    const listForm = this.getSearchForm();
    if (setGlobalState && listForm) {
      setGlobalState({ [listForm.name]: results });
    } else {
      this.setState({ results });
    }
  }

  getList(): T[] {
    return this.list;
  }

  sort(event: any) {
    event.preventDefault();
    handleSortEvent(event, this);
    if (this.appendMode === false) {
      this.doSearch();
    } else {
      this.resetAndSearch();
    }
  }
  showMore(event: any) {
    event.preventDefault();
    this.tmpPageIndex = this.pageIndex;
    more(this);
    this.doSearch();
  }
  pageSizeChanged = (event: any) => {
    const size = parseInt(event.currentTarget.value, null);
    changePageSize(this, size);
    this.tmpPageIndex = 1;
    this.doSearch();
  }

  pageChanged(data) {
    const { currentPage, itemsPerPage } = data;
    changePage(this, currentPage, itemsPerPage);
    this.doSearch();
  }
}
export interface SearchState<T> {
  keyword: string;
  results: T[];
}
export interface SearchService<T, S extends SearchModel> {
  search(s: S, ctx?: any): Promise<SearchResult<T>>;
}
export class SearchComponent<T, S extends SearchModel, W extends HistoryProps, I extends SearchState<T>> extends BaseSearchComponent<T, S, W, I> {
  constructor(props, protected service: SearchService<T, S>, listFormId?: string) {
    super(props, listFormId);
    this.search = this.search.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.ref = React.createRef();
  }
  protected ref: any;
  componentDidMount() {
    this.form = initForm(this.ref.current, initMaterial);
    const s = this.mergeSearchModel(buildFromUrl());
    this.load(s, storage.autoSearch);
  }
  async search(s: S) {
    try {
      const sr = await this.service.search(s);
      this.showResults(s, sr);
    } catch (err) {
      this.searchError(err);
    }
  }
}


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
