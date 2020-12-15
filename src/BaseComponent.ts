import {focusFirstError, readOnly} from 'form-util';
import * as React from 'react';
import {setValue} from 'reflectx';
import {clone, makeDiff} from 'reflectx';
import {addParametersIntoUrl, append, buildSearchMessage, changePage, changePageSize, formatResults, getDisplayFields, handleSortEvent, initSearchable, mergeSearchModel, more, optimizeSearchModel, reset, Searchable, SearchModel, SearchResult, showResults} from 'search-utilities';
import {buildId, error, initForm, LoadingService, Locale, message, messageByHttpStatus, Metadata, removePhoneFormat, ResourceService, UIService} from './core';
import {build, buildMessageFromStatusCode, createModel, handleVersion, initPropertyNullInModel, ResultInfo, Status} from './edit';
import {HistoryProps} from './HistoryProps';
import {buildFromUrl} from './route';
import {valueOf} from './util';

export const enLocale = {
  'id': 'en-US',
  'countryCode': 'US',
  'dateFormat': 'M/d/yyyy',
  'firstDayOfWeek': 1,
  'decimalSeparator': '.',
  'groupSeparator': ',',
  'decimalDigits': 2,
  'currencyCode': 'USD',
  'currencySymbol': '$',
  'currencyPattern': 0
};
export class BaseViewComponent<W extends HistoryProps, I> extends React.Component<W, I & any> {
  constructor(props, protected resourceService: ResourceService, protected getLocale?: () => Locale) {
    super(props);
    this.resource = resourceService.resource();
    if (getLocale) {
      this.getLocale = this.getLocale.bind(this);
    }
    this.back = this.back.bind(this);
  }
  protected resource: any = {};
  protected includingCurrencySymbol = false;
  protected dateTimeFormat: string = null;
  protected running: boolean;
  protected form: any;

  protected currencySymbol(): boolean {
    return this.includingCurrencySymbol;
  }

  protected getCurrencyCode(): string {
    return (this.form ? this.form.getAttribute('currency-code') : null);
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
}

export interface ViewService<T, ID> {
  metadata?(): Metadata;
  keys?(): string[];
  load(id: ID, ctx?: any): Promise<T>;
}
export class ViewComponent<T, ID, W extends HistoryProps, I> extends BaseViewComponent<W, I> {
  constructor(props, param: ((id: ID, ctx?: any) => Promise<T>)|ViewService<T, ID>,
      resourceService: ResourceService,
      protected showError: (msg: string, title?: string, detail?: string, callback?: () => void) => void,
      getLocale?: () => Locale,
      protected loading?: LoadingService) {
    super(props, resourceService, getLocale);
    if (param) {
      if (typeof param === 'function') {
        this.loadFn = param;
      } else {
        this.service = param;
        if (this.service.metadata) {
          const m = this.service.metadata();
          if (m) {
            this.metadata = m;
            const meta = build(m);
            this.keys = meta.keys;
          }
        }
      }
    }
    this.getModelName = this.getModelName.bind(this);
    this.load = this.load.bind(this);
    this.getModel = this.getModel.bind(this);
    this.showModel = this.showModel.bind(this);
    this.handleError = this.handleError.bind(this);
    this.ref = React.createRef();
  }
  protected loadFn: (id: ID, ctx?: any) => Promise<T>;
  protected service: ViewService<T, ID>;
  protected form: any;
  protected ref: any;
  protected keys: string[];
  protected metadata?: Metadata;

  protected getModelName() {
    if (this.metadata) {
      return this.metadata.name;
    }
    if (this.form) {
      const a = this.form.getAttribute('model-name');
      if (a && a.length > 0) {
        return a;
      }
      const b = this.form.name;
      if (b) {
        if (b.endsWith('Form')) {
          return b.substr(0, b.length - 4);
        }
        return b;
      }
    }
    return 'model';
  }
  componentDidMount() {
    this.form = this.ref.current;
    const id = buildId<ID>(this.keys, this.props);
    this.load(id);
  }
  async load(_id: ID) {
    const id: any = _id;
    if (id != null && id !== '') {
      this.running = true;
      if (this.loading) {
        this.loading.showLoading();
      }
      try {
        const ctx: any = {};
        let obj: T;
        if (this.loadFn) {
          obj = await this.loadFn(id, ctx);
        } else {
          obj = await this.service.load(id, ctx);
        }
        if (!obj) {
          this.handleNotFound(this.form);
        } else {
          this.showModel(obj);
        }
      } catch (err) {
        const data = (err &&  err.response) ? err.response : err;
        if (data && data.status === 404) {
          this.handleNotFound(this.form);
        } else {
          this.handleError(err);
        }
      } finally {
        this.running = false;
        if (this.loading) {
          this.loading.hideLoading();
        }
      }
    }
  }
  protected handleNotFound(form?: any): void {
    const msg = message(this.resourceService, 'error_not_found', 'error');
    if (form) {
      readOnly(form);
    }
    this.showError(msg.message, msg.title);
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
  handleError(response: any): void {
    const r = this.resourceService;
    const title = r.value('error');
    let msg = r.value('error_internal');
    if (response) {
      if (response.status && !isNaN(response.status)) {
        msg = messageByHttpStatus(response.status, r);
      }
    }
    this.showError(msg, title);
  }
}

export class BaseComponent<W extends HistoryProps, I> extends BaseViewComponent<W, I> {
  constructor(props, resourceService: ResourceService, ui: UIService,
      getLocale?: () => Locale,
      protected loading?: LoadingService) {
    super(props, resourceService, getLocale);
    this.uiS1 = ui;

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
    const value = removePhoneFormat(event.currentTarget.value);
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
        if (this.getLocale) {
          locale = this.getLocale();
        } else {
          locale = enLocale;
        }
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
            let tmLoc = null;
            if (this.getLocale) {
              tmLoc = this.getLocale();
            } else {
              tmLoc = enLocale;
            }
            const tloc = (!locale ? tmLoc : locale);
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
  constructor(props,
      resourceService: ResourceService,
      protected ui: UIService,
      protected showMessage: (msg: string) => void,
      getLocale?: () => Locale,
      protected listFormId?: string) {
    super(props, resourceService, ui, getLocale);
    this.ui = ui;
    this.showMessage = this.showMessage.bind(this);

    this.toggleFilter = this.toggleFilter.bind(this);
    this.mergeUrlSearchModel = this.mergeUrlSearchModel.bind(this);
    this.mergeSearchModel = this.mergeSearchModel.bind(this);
    this.load = this.load.bind(this);
    this.add = this.add.bind(this);
    this.getSearchForm = this.getSearchForm.bind(this);
    this.setSearchForm = this.setSearchForm.bind(this);

    this.setSearchModel = this.setSearchModel.bind(this);
    this.getOriginalSearchModel = this.getOriginalSearchModel.bind(this);
    this.getSearchModel = this.getSearchModel.bind(this);
    this.getDisplayFields = this.getDisplayFields.bind(this);

    this.pageSizeChanged = this.pageSizeChanged.bind(this);
    this.clearKeyword = this.clearKeyword.bind(this);
    this.searchOnClick = this.searchOnClick.bind(this);

    this.resetAndSearch = this.resetAndSearch.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.search = this.search.bind(this);
    this.validateSearch = this.validateSearch.bind(this);
    this.showResults = this.showResults.bind(this);
    this.setList = this.setList.bind(this);
    this.getList = this.getList.bind(this);
    this.sort = this.sort.bind(this);
    this.showMore = this.showMore.bind(this);
    this.pageChanged = this.pageChanged.bind(this);

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

  // Pagination
  initPageSize = 20;
  pageSize = 20;
  pageIndex = 1;
  itemTotal = 0;
  pageTotal = 0;
  showPaging = false;
  append = false;
  appendMode = false;
  appendable = false;

  // Sortable
  sortField: string;
  sortType: string;
  sortTarget: any; // HTML element

  keys: string[];
  formatter: LocaleFormatter<T>;
  displayFields: string[];
  initDisplayFields = false;
  sequenceNo = 'sequenceNo';
  triggerSearch = false;
  tmpPageIndex = 1;

  pageMaxSize = 7;
  pageSizes: number[] = [10, 20, 40, 60, 100, 200, 400, 800];

  private list: T[];
  excluding: any;
  hideFilter: boolean;

  ignoreUrlParam = false;
  // locationSearch: string;
  // _currentSortField: string;

  viewable = true;
  addable = true;
  editable = true;
  approvable = true;
  deletable = true;

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
    if (this.keys && this.keys.length == 1) {
      const l = this.getList();
      if (l && l.length > 0) {
        const refId = l[l.length - 1][this.keys[0]]
        if (refId) {
          obj3.refId = '' + refId;
        }
      }
    }
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

  protected clearKeyword() {
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
      if (this.loading) {
        this.loading.showLoading();
      }
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
      const m1 = buildSearchMessage(s, sr, this.resourceService);
      this.showMessage(m1);
    } else {
      if (com.append === true && s.page > 1) {
        com.appendList(results);
      } else {
        com.setList(results);
      }
    }
    com.running = false;
    if (this.loading) {
      this.loading.hideLoading();
    }
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
  keys?(): string[];
}
export class SearchComponent<T, S extends SearchModel, W extends HistoryProps, I extends SearchState<T>> extends BaseSearchComponent<T, S, W, I> {
  constructor(props, param: ((s: S, ctx?: any) => Promise<SearchResult<T>>) | SearchService<T, S>,
      resourceService: ResourceService,
      ui: UIService,
      showMessage: (msg: string) => void,
      protected showError: (m: string, header?: string, detail?: string, callback?: () => void) => void,
      getLocale?: () => Locale,
      protected loading?: LoadingService,
      autoSearch?: boolean,
      listFormId?: string) {
    super(props, resourceService, ui, showMessage, getLocale, listFormId);
    if (autoSearch === false) {
      this.autoSearch = autoSearch;
    }
    if (param) {
      if (typeof param === 'function') {
        const x: any = param;
        this.searchFn = x;
      } else {
        this.service = param;
        if (this.service.keys) {
          this.keys = this.service.keys();
        }
      }
    }
    this.search = this.search.bind(this);
    this.showError = this.showError.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.ref = React.createRef();
  }
  protected searchFn: (s: S, ctx?: any) => Promise<SearchResult<T>>;
  protected service: SearchService<T, S>;
  protected ref: any;
  protected autoSearch = true;
  componentDidMount() {
    this.form = initForm(this.ref.current, this.ui.initMaterial);
    const s = this.mergeSearchModel(buildFromUrl());
    this.load(s, this.autoSearch);
  }
  async search(s: S) {
    try {
      const ctx: any = {};
      this.running = true;
      if (this.loading) {
        this.loading.showLoading();
      }
      if (this.searchFn) {
        const sr = await this.searchFn(s, ctx);
        this.showResults(s, sr);  
      } else {
        const sr = await this.service.search(s, ctx);
        this.showResults(s, sr);
      }
    } catch (err) {
      this.pageIndex = this.tmpPageIndex;
      error(err, this.resourceService, this.showError)
    } finally {
      this.running = false;
      if (this.loading) {
        this.loading.hideLoading();
      }
    }
  }
}

export abstract class BaseEditComponent<T, W extends HistoryProps, I> extends BaseComponent<W, I> {
  constructor(props,
      resourceService: ResourceService,
      protected ui: UIService,
      protected showMessage: (msg: string) => void,
      protected showError: (m: string, title?: string, detail?: string, callback?: () => void) => void,
      protected confirm: (m2, header: string, yesCallback?: () => void, btnLeftText?: string, btnRightText?: string, noCallback?: () => void) => void,
      getLocale?: () => Locale,
      loading?: LoadingService,
      patchable?: boolean, backOnSaveSuccess?: boolean) {
    super(props, resourceService, ui, getLocale, loading);
    this.ui = ui;
    if (patchable === false) {
      this.patchable = patchable;
    }
    if (backOnSaveSuccess === false) {
      this.backOnSuccess = backOnSaveSuccess;
    }
    this.insertSuccessMsg = resourceService.value('msg_save_success');
    this.updateSuccessMsg = resourceService.value('msg_save_success');

    this.showMessage = this.showMessage.bind(this);
    this.showError = this.showError.bind(this);
    this.confirm = this.confirm.bind(this);

    this.getModelName = this.getModelName.bind(this);

    this.resetState = this.resetState.bind(this);
    this.handleNotFound = this.handleNotFound.bind(this);
    this.showModel = this.showModel.bind(this);
    this.getModel = this.getModel.bind(this);
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
  }
  backOnSuccess = true;
  protected metadata: Metadata;
  protected keys: string[];
  protected version?: string;
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
    const msg = message(this.resourceService, 'error_not_found', 'error');
    if (form) {
      readOnly(form);
    }
    this.showError(msg.message, msg.title);
  }
  protected getModelName() {
    if (this.metadata) {
      return this.metadata.name;
    }
    if (this.form) {
      const a = this.form.getAttribute('model-name');
      if (a && a.length > 0) {
        return a;
      }
      const b = this.form.name;
      if (b) {
        if (b.endsWith('Form')) {
          return b.substr(0, b.length - 4);
        }
        return b;
      }
    }
    return 'model';
  }
  getModel(): T {
    const n = this.getModelName();
    return this.props[n] || this.state[n];
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
    const r = this.resourceService;
    if (this.newMode === true && this.addable === false) {
      const m = message(r, 'error_permission_add', 'error_permission');
      this.showError(m.message, m.title);
      return;
    } else if (this.newMode === false && this.editable === false) {
      const msg = message(r, 'error_permission_edit', 'error_permission');
      this.showError(msg.message, msg.title);
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
            com.save(obj, obj, isBack);
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
    this.showError(result.message, t);
  }

  protected postSave(res: number|ResultInfo<T>, backOnSave?: boolean) {
    this.running = false;
    if (this.loading) {
      this.loading.hideLoading();
    }
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
        const r = this.resourceService;
        const msg = buildMessageFromStatusCode(result.status, r);
        const title = r.value('error');
        if (msg && msg.length > 0) {
          this.showError(msg, title);
        } else if (result.message && result.message.length > 0) {
          this.showError(result.message, title);
        } else {
          this.showError(r.value('error_internal'), title);
        }
      }
    }
  }

  protected handleDuplicateKey(result?: ResultInfo<T>) {
    const msg = message(this.resourceService, 'error_duplicate_key', 'error');
    this.showError(msg.message, msg.title);
  }
}

export interface GenericService<T, ID, R> extends ViewService<T, ID> {
  patch?(obj: T, ctx?: any): Promise<R>;
  insert(obj: T, ctx?: any): Promise<R>;
  update(obj: T, ctx?: any): Promise<R>;
  delete?(id: ID, ctx?: any): Promise<number>;
}

export class EditComponent<T, ID, W extends HistoryProps, I> extends BaseEditComponent<T, W, I>  {
  constructor(props, protected service: GenericService<T, ID, number|ResultInfo<T>>,
      resourceService: ResourceService,
      ui: UIService,
      showMessage: (msg: string) => void,
      showError: (m: string, title?: string, detail?: string, callback?: () => void) => void,
      confirm: (m2: string, header: string, yesCallback?: () => void, btnLeftText?: string, btnRightText?: string, noCallback?: () => void) => void,
      getLocale?: () => Locale,
      loading?: LoadingService,
      patchable?: boolean, backOnSaveSuccess?: boolean) {
    super(props, resourceService, ui, showMessage, showError, confirm, getLocale, loading, patchable, backOnSaveSuccess);
    if (service.metadata) {
      const metadata = service.metadata();
      if (metadata) {
        const meta = build(metadata);
        this.keys = meta.keys;
        this.version = meta.version;
        this.metadata = metadata;
      }
    }
    if (!this.keys && service.keys) {
      const k = service.keys();
      if (k) {
        this.keys = k;
      }
    }
    if (!this.keys) {
      this.keys = [];
    }
    this.load = this.load.bind(this);
    this.save = this.save.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.ref = React.createRef();
  }
  protected ref: any;
  componentDidMount() {
    this.form = initForm(this.ref.current, this.ui.initMaterial);
    const id = buildId<ID>(this.keys, this.props);
    this.load(id);
  }
  async load(_id: ID) {
    const id: any = _id;
    if (id != null && id !== '') {
      try {
        this.running = true;
        if (this.loading) {
          this.loading.showLoading();
        }
        const ctx: any = {};
        const obj = await this.service.load(id, ctx);
        if (!obj) {
          this.handleNotFound(this.form);
        } else {
          this.resetState(false, obj, clone(obj));
        }
      } catch (err) {
        const data = (err &&  err.response) ? err.response : err;
        const r = this.resourceService;
        const title = r.value('error');
        let msg = r.value('error_internal');
        if (data && data.status === 404) {
          this.handleNotFound(this.form);
        } else if (data && (data.status === 403 || data.status === 404)) {
          if (data.status && !isNaN(data.status)) {
            msg = messageByHttpStatus(data.status, r);
          }
          if (data.status === 403) {
            msg = r.value('error_forbidden');
          } else if (data.status === 401) {
            msg = r.value('error_forbidden');
          }
          readOnly(this.form);
          this.showError(msg, title);
        } else {
          if (data.status && !isNaN(data.status)) {
            msg = messageByHttpStatus(data.status, r);
          }
          this.showError(msg, title);
        }
      } finally {
        this.running = false;
        if (this.loading) {
          this.loading.hideLoading();
        }
      }
    } else {
      // Call service state
      const obj = this.createModel();
      this.resetState(true, obj, null);
    }
  }
  protected async save(obj: T, body?: T, isBack?: boolean) {
    this.running = true;
    if (this.loading) {
      this.loading.showLoading();
    }
    const isBackO = (isBack == null || isBack === undefined ? this.backOnSuccess : isBack);
    const com = this;
    try {
      const ctx: any = {};
      if (!this.newMode) {
        if (this.patchable === true && body && Object.keys(body).length > 0) {
          const result = await this.service.patch(body, ctx);
          com.postSave(result, isBackO);
        } else {
          const result = await this.service.update(obj, ctx);
          com.postSave(result, isBackO);
        }
      } else {
        const result = await this.service.insert(obj, ctx);
        com.postSave(result, isBackO);
      }
    } catch (err) {
      error(err, this.resourceService, this.showError)
    } finally {
      this.running = false;
      if (this.loading) {
        this.loading.hideLoading();
      }
    }
  }
}
