import {addParametersIntoUrl, append, buildSearchMessage, changePage, changePageSize, formatResults, getDisplayFields, handleSortEvent, initSearchable, mergeSearchModel, more, optimizeSearchModel, reset, Searchable, SearchModel, SearchResult, showResults} from 'search-utilities';
import {Locale, storage} from 'uione';
import {UIService} from 'uione';
import {BaseComponent} from './BaseComponent';
import {HistoryProps} from './HistoryProps';
import {SearchState} from './SearchState';

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
