import {useEffect, useState} from 'react';
import {addParametersIntoUrl, append, buildSearchMessage, formatResults, getDisplayFieldsFromForm, getModel, handleSort, initSearchable, mergeSearchModel as mergeSearchModel2, removeSortStatus, Searchable, showResults as showResults2, validate} from 'search-utilities';
import {useBase, useBaseProps} from './base';
import {error, initForm, Locale, ModelProps, ResourceService, SearchModel, SearchParameter, SearchPermission, SearchResult, SearchService} from './core';
import {DispatchWithCallback, useMergeState} from './merge';
import {buildFromUrl} from './route';
import {useRouter} from './router';

function prepareData(data: any): void {
}
export interface SearchComponentParam<T, M extends SearchModel, S> extends BaseSearchComponentParam<T, M, S> {
  createSearchModel?: () => M;
  initialize?: (ld: (s: M, auto?: boolean) => void, setState2: DispatchWithCallback<Partial<S>>, com?: SearchComponentState<T, M>) => void;
}
export interface HookPropsSearchParameter<T, S extends SearchModel, ST, P extends ModelProps> extends HookPropsBaseSearchParameter<T, S, ST, P> {
  createSearchModel?: () => S;
  initialize?: (ld: (s: S, auto?: boolean) => void, setState2: DispatchWithCallback<Partial<ST>>, com?: SearchComponentState<T, S>) => void;
}
export interface BaseSearchComponentParam<T, M extends SearchModel, S> extends SearchPermission {
  keys?: string[];
  sequenceNo?: string;
  modelName?: string;
  appendMode?: boolean;
  pageSizes?: number[];
  pageIndex?: number;
  pageSize?: number;
  initPageSize?: number;
  pageMaxSize?: number;

  load?: (s: M, auto?: boolean) => void;
  getModelName?: () => string;
  getCurrencyCode?: () => string;
  setSearchModel?: (s: M) => void;
  getSearchModel?: () => M;
  getDisplayFields?: () => string[];
  validateSearch?: (se: M, callback: () => void) => void;
  prepareCustomData?: (data: any) => void;
  format?(obj: T, locale: Locale): T;
  showResults?(s: M, sr: SearchResult<T>): void;
  appendList?(results: T[]): void;
  setList?(list: T[]): void;
  showLoading?(firstTime?: boolean): void;
  hideLoading?(): void;
  decodeFromForm?(form: HTMLFormElement, locale?: Locale, currencyCode?: string): any;
  registerEvents?(form: HTMLFormElement): void;
  validateForm?(form: HTMLFormElement, locale?: Locale, focusFirst?: boolean, scroll?: boolean): boolean;
  removeFormError?(form: HTMLFormElement): void;
  removeError?(el: HTMLInputElement): void;
}
export interface HookBaseSearchParameter<T, S extends SearchModel, ST> extends BaseSearchComponentParam<T, S, ST> {
  refForm: any;
  initialState: ST;
  search: ((s: S, ctx?: any) => Promise<SearchResult<T>>) | SearchService<T, S>;
  resourceService: ResourceService;
  showMessage: (msg: string) => void;
  showError: (m: string, header?: string, detail?: string, callback?: () => void) => void;
  getLocale?: () => Locale;
  autoSearch?: boolean;
}
export interface HookPropsBaseSearchParameter<T, S extends SearchModel, ST, P extends ModelProps> extends HookBaseSearchParameter<T, S, ST> {
  props?: P;
  prepareCustomData?: (data: any) => void;
}
export interface SearchComponentState<T, S> extends Searchable {
  keys?: string[];
  model?: S;
  list?: T[];

  format?: (obj: T, locale: Locale) => T;
  displayFields?: string[];
  initDisplayFields?: boolean;
  sequenceNo?: string;
  triggerSearch?: boolean;
  tmpPageIndex?: number;

  pageMaxSize?: number;
  pageSizes?: number[];
  excluding?: any;
  hideFilter?: boolean;

  ignoreUrlParam?: boolean;
  viewable?: boolean;
  addable?: boolean;
  editable?: boolean;
  approvable?: boolean;
  deletable?: boolean;
  isFirstTime?: boolean;
}
export const pageSizes = [10, 20, 40, 60, 100, 200, 400, 800];
export const useSearch = <T, S extends SearchModel, ST>(
  refForm: any,
  initialState: ST,
  search: ((s: S, ctx?: any) => Promise<SearchResult<T>>) | SearchService<T, S>,
  p1: SearchParameter,
  p2?: SearchComponentParam<T, S, ST>,
  p3?: SearchPermission,
) => {
  const baseProps = useBaseSearchProps(null, refForm, initialState, search, p1, p2, p3);

  useEffect(() => {
    const { load, setState, component } = baseProps;
    if (refForm) {
      const registerEvents = (p1.ui ? p1.ui.registerEvents : null);
      initForm(refForm.current, registerEvents);
    }
    if (p2.initialize) {
      p2.initialize(load, setState, component);
    } else {
      const se: S = (p2.createSearchModel ? p2.createSearchModel() : null);
      const s: any = mergeSearchModel2(buildFromUrl<S>(), se, component.pageSizes);
      load(s, p1.auto);
    }
  }, []);
  return { ...baseProps };
};
export const useSearchOneProps = <T, S extends SearchModel, ST, P>(p: HookPropsSearchParameter<T, S, ST, P>) => {
  const baseProps = useBaseSearchOne(p);
  /*
  useEffect(() => {
    if (!component.isFirstTime) {
    doSearch();
    }
  }, [component.pageSize, component.pageIndex]);
  */
  useEffect(() => {
    const { load, setState, component } = baseProps;
    if (p.refForm) {
      initForm(p.refForm.current, p.registerEvents);
    }
    if (p.initialize) {
      p.initialize(load, setState, component);
    } else {
      const se: S = (p.createSearchModel ? p.createSearchModel() : null);
      const s: any = mergeSearchModel2(buildFromUrl<S>(), se, component.pageSizes);
      load(s, p.autoSearch);
    }
  }, []);

  return { ...baseProps };
};
export const useBaseSearch = <T, S extends SearchModel, ST>(
  refForm: any,
  initialState: ST,
  search: ((s: S, ctx?: any) => Promise<SearchResult<T>>) | SearchService<T, S>,
  p1: SearchParameter,
  p2?: BaseSearchComponentParam<T, S, ST>,
  p3?: SearchPermission
) => {
  return useBaseSearchProps(null, refForm, initialState, search, p1, p2, p3);
};
export const useBaseSearchProps = <T, S extends SearchModel, ST, P extends ModelProps>(
  props: P,
  refForm: any,
  initialState: ST,
  search: ((s: S, ctx?: any) => Promise<SearchResult<T>>) | SearchService<T, S>,
  p1: SearchParameter,
  p2?: BaseSearchComponentParam<T, S, ST>,
  p3?: SearchPermission
) => {
  let sequenceNo = 'sequenceNo';
  if (p2 && p2.sequenceNo) {
    sequenceNo = p2.sequenceNo;
  }
  let keys = p2.keys;
  if (!keys && typeof search !== 'function') {
    keys = search.keys();
  }
  const p: HookPropsBaseSearchParameter<T, S, ST, P> = {
    props,
    refForm,
    initialState,
    search,
    resourceService: p1.resource,
    showMessage: p1.showMessage,
    showError: p1.showError,
    getLocale: p1.getLocale,
    autoSearch: p1.auto,
    keys,
    sequenceNo,
  };
  const per: SearchPermission = (p3 ? p3 : p2);
  if (per) {
    p.viewable = per.viewable;
    p.addable = per.addable;
    p.editable = per.editable;
    p.deletable = per.deletable;
    p.approvable = per.approvable;
  }
  if (p2) {
    p.load = p2.load;
    p.appendMode = p2.appendMode;
    p.format = p2.format;
    p.pageSizes = p2.pageSizes;
    p.pageIndex = p2.pageIndex;
    p.pageSize = p2.pageSize;
    p.initPageSize = p2.initPageSize;
    p.showResults = p2.showResults;
    p.appendList = p2.appendList;
    p.setList = p2.setList;
    p.prepareCustomData = p2.prepareCustomData;
    if (p1.ui) {
      const u = p1.ui;
      p.decodeFromForm = (p2.decodeFromForm ? p2.decodeFromForm : u.decodeFromForm);
      p.registerEvents = (p2.registerEvents ? p2.registerEvents : u.registerEvents);
      p.validateForm = (p2.validateForm ? p2.validateForm : u.validateForm);
      p.removeFormError = (p2.removeFormError ? p2.removeFormError : u.removeFormError);
      p.removeError = (p2.removeError ? p2.removeError : u.removeError);
    }
    if (p1.loading) {
      const l = p1.loading;
      p.showLoading = (l ? l.showLoading : p1.loading.showLoading);
      p.hideLoading = (l ? l.hideLoading : p1.loading.hideLoading);
    }
  } else {
    if (p1.ui) {
      const u = p1.ui;
      p.decodeFromForm = u.decodeFromForm;
      p.registerEvents = u.registerEvents;
      p.validateForm = u.validateForm;
      p.removeFormError = u.removeFormError;
      p.removeError = u.removeError;
    }
    if (p1.loading) {
      p.showLoading = p1.loading.showLoading;
      p.hideLoading = p1.loading.hideLoading;
    }
  }
  if (!p.pageIndex || p.pageIndex < 1) {
    p.pageIndex = 1;
  }
  if (!p.pageSize) {
    p.pageSize = 20;
  }
  if (!p.initPageSize) {
    p.initPageSize = p.pageSize;
  }
  if (!p.pageSizes) {
    p.pageSizes = pageSizes;
  }
  if (!p.pageMaxSize) {
    p.pageMaxSize = 7;
  }
  return useBaseSearchOne(p);
};
export const useBaseSearchOne = <T, S extends SearchModel, ST, P extends ModelProps>(p: HookPropsBaseSearchParameter<T, S, ST, P>) => {
  const [running, setRunning] = useState(undefined);
  const {
    viewable = true,
    addable = true,
    editable = true
  } = p;
  const _getModelName = (): string => {
    return 'model';
  };
  const getModelName = (p.getModelName ? p.getModelName : _getModelName);

  // const setState2: <K extends keyof S, P>(st: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null), cb?: () => void) => void;
  const baseProps = (p.props ? useBaseProps<ST, P>(p.props, p.initialState, p.getLocale, p.removeError, getModelName, p.prepareCustomData) : useBase<ST>(p.initialState, p.getLocale, p.removeError, getModelName));
  const { state, setState } = baseProps;
  const { match, push } = useRouter();

  const _getCurrencyCode = (): string => {
    return p.refForm && p.refForm.current ? p.refForm.current.getAttribute('currency-code') : null;
  };
  const getCurrencyCode = p.getCurrencyCode ? p.getCurrencyCode : _getCurrencyCode;

  const prepareCustomData = (p.prepareCustomData ? p.prepareCustomData : prepareData);
  const updateDateState = (name: string, value: any) => {
    const modelName = getModelName();
    const currentState = state[modelName];
    if (p.props.setGlobalState) {
      const data = p.props.shouldBeCustomized ? prepareCustomData({ [name]: value }) : { [name]: value };
      p.props.setGlobalState({ [modelName]: { ...currentState, ...data } });
    } else {
      setState({ [modelName]: { ...currentState, [name]: value } } as T);
    }
    setState({ [modelName]: { ...currentState, [name]: value } } as T);
  };

  const p2: SearchComponentState<T, S> = {
    model: {} as any,
    pageIndex: p.pageIndex,
    pageSize: p.pageSize,
    initPageSize: p.initPageSize,
    sequenceNo: p.sequenceNo,
    pageSizes: p.pageSizes,
    itemTotal: 0,
    pageTotal: 0,
    showPaging: false,
    append: false,
    appendMode: p.appendMode,
    appendable: false,
    sortField: '',
    sortType: '',
    sortTarget: null,
    format: null,
    displayFields: [],
    initDisplayFields: false,
    triggerSearch: false,
    tmpPageIndex: null,
    pageMaxSize: 7,
    list: null,
    excluding: null,
    hideFilter: null,
    ignoreUrlParam: false,
    viewable,
    addable,
    editable,
    deletable: p.deletable,
    approvable: p.approvable,
    isFirstTime: true
  };
  const [component, setComponent] = useMergeState<SearchComponentState<T, S>>(p2);

  const toggleFilter = (event: any): void => {
    setComponent({ hideFilter: !component.hideFilter });
  };

  const add = (event) => {
    event.preventDefault();
    push(match.url + '/add');
  };

  const _getDisplayFields = (): string[] => {
    const { displayFields, initDisplayFields } = component;
    const fs = getDisplayFieldsFromForm(displayFields, initDisplayFields, p.refForm.current);
    setComponent({ displayFields: fs, initDisplayFields: true });
    return fs;
  };
  const getDisplayFields = p.getDisplayFields ? p.getDisplayFields : _getDisplayFields;

  const getSearchModel = (): S => {
    const n = getModelName();
    const fs = getDisplayFields();
    const lc = p.getLocale();
    const cc = getCurrencyCode();
    const obj3 = getModel<T, S>(state, n, component, fs, component.excluding, component.keys, component.list, p.refForm.current, p.decodeFromForm, lc, cc);
    return obj3;
  };
  const _setSearchModel = (s: S): void => {
    const objSet: any = {};
    const n = getModelName();
    objSet[n] = s;
    setState(objSet);
  };

  const _load = (s: S, auto?: boolean): void => {
    const com = Object.assign({}, component);
    const obj2 = initSearchable(s, com);
    setComponent(com);
    setSearchModel(obj2);
    const runSearch = doSearch;
    if (auto) {
      setTimeout(() => {
        runSearch(true);
      }, 0);
    }
  };
  const load = p.load ? p.load : _load;

  const setSearchModel = p.setSearchModel ? p.setSearchModel : _setSearchModel;
  const doSearch = (isFirstLoad?: boolean) => {
    const f = p.refForm.current;
    if (f && p.removeFormError) {
      p.removeFormError(f);
    }
    const s = getSearchModel();
    const isStillRunning = running;
    validateSearch(s, () => {
      if (isStillRunning === true) {
        return;
      }
      setRunning(true);
      if (p.showLoading) {
        p.showLoading();
      }
      if (!component.ignoreUrlParam) {
        addParametersIntoUrl(s, isFirstLoad);
      }
      call(s);
    });
  };

  const _validateSearch = (se: S, callback: () => void) => {
    validate(se, callback, p.refForm.current, p.getLocale(), p.validateForm);
  };
  const validateSearch = p.validateSearch ? p.validateSearch : _validateSearch;

  const pageSizeChanged = (event: any) => {
    const size = parseInt(event.currentTarget.value, 10);
    setComponent({
      initPageSize: size,
      pageSize: size,
      pageIndex: 1
    });
    setComponent({ tmpPageIndex: 1, isFirstTime: false });
  };

  const clearKeyworkOnClick = () => {
    const n = getModelName();
    if (n && n.length > 0) {
      const m = state[n];
      if (m) {
        m.keyword = '';
        const setObj: any = {};
        setObj[n] = m;
        setState(setObj);
        return;
      }
    }
    setState({
      keyword: ''
    } as any);
  };

  const searchOnClick = (event: any): void => {
    if (event) {
      event.preventDefault();
    }
    resetAndSearch();
  };

  const sort = (event: any) => {
    event.preventDefault();
    if (event && event.target) {
      const target = event.target;
      const s = handleSort(target, component.sortTarget, component.sortField, component.sortType);
      setComponent({
        sortField: s.field,
        sortType: s.type,
        sortTarget: target
      });
    }
    if (!component.appendMode) {
      doSearch();
    } else {
      resetAndSearch();
    }
  };

  const resetAndSearch = () => {
    if (running === true) {
      setComponent({ pageIndex: 1, triggerSearch: true });
      return;
    }
    setComponent({ pageIndex: 1, tmpPageIndex: 1 });
    removeSortStatus(component.sortTarget);
    setComponent({
      sortTarget: null,
      sortField: null,
      append: false,
      pageIndex: 1
    });
    doSearch();
  };

  const searchError = (err: any): void => {
    setComponent({ pageIndex: component.tmpPageIndex });
    error(err, p.resourceService.value, p.showError);
  };
  const _appendList = (results: T[]) => {
    const list = (state as any).results;
    const arr = append(list, results);
    if (p.props) {
      const listForm = p.refForm.current;
      const setGlobalState = p.props.setGlobalState;
      if (setGlobalState && listForm) {
        setGlobalState({ [listForm.name]: arr });
        return;
      }
    }
    setState({ list: arr } as any);
  };
  const appendList = (p.appendList ? p.appendList : _appendList);
  const _setList = (list: T[]) => {
    if (p.props) {
      const setGlobalState = p.props.setGlobalState;
      setComponent({ list });
      if (setGlobalState) {
        const listForm = p.refForm.current;
        if (listForm) {
          setGlobalState({ [listForm.name]: list });
          return;
        }
      }
    }
    setState({ list } as any);
  };
  const setList = (p.setList ? p.setList : _setList);
  const _showResults = (s: S, sr: SearchResult<T>) => {
    const results = sr.results;
    if (results && results.length > 0) {
      const lc = p.getLocale();
      formatResults(results, p.pageIndex, p.pageSize, p.initPageSize, p.sequenceNo, p.format, lc);
    }
    const am = component.appendMode;
    showResults2(s, sr, component);
    if (!am) {
      setList(results);
      setComponent({ tmpPageIndex: s.page });
      const m1 = buildSearchMessage(s, sr, p.resourceService);
      p.showMessage(m1);
    } else {
      if (component.append && s.page > 1) {
        appendList(results);
      } else {
        setList(results);
      }
    }
    setRunning(false);
    if (p.hideLoading) {
      p.hideLoading();
    }
    if (component.triggerSearch) {
      setComponent({ triggerSearch: false });
      resetAndSearch();
    }
  };
  const showResults = (p.showResults ? p.showResults : _showResults);

  const showMore = (event: any) => {
    event.preventDefault();
    setComponent({ append: true, pageIndex: component.pageIndex + 1 });
    setComponent({ tmpPageIndex: component.pageIndex });
    doSearch();
  };

  const pageChanged = (data) => {
    const { currentPage, itemsPerPage } = data;
    setComponent({ pageIndex: currentPage, pageSize: itemsPerPage, append: false });
    setComponent({ isFirstTime: false });
  };

  // const { searchQueries } = useRouter();

  const call = async (s: S) => {
    try {
      const ctx: any = {};
      if (typeof p.search === 'function') {
        const sr = await p.search(s, ctx);
        showResults(s, sr);
      } else {
        const sr = await p.search.search(s, ctx);
        showResults(s, sr);
      }
    } catch (err) {
      searchError(err);
    }
  };

  return {
    ...baseProps,
    running,
    setRunning,
    getCurrencyCode,
    updateDateState,
    resource: p.resourceService.resource(),
    setComponent,
    component,
    showMessage: p.showMessage,
    load,
    add,
    searchOnClick,
    sort,
    showMore,
    toggleFilter,
    doSearch,
    pageChanged,
    pageSizeChanged,
    clearKeyworkOnClick,
    showResults,
    getDisplayFields,
    getModelName,
    format: p.format
  };
};
