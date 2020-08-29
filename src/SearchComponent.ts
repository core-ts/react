import * as React from 'react';
import {SearchModel, SearchResult} from 'search-utilities';
import {initForm, initMaterial, storage} from 'uione';
import {BaseSearchComponent} from './BaseSearchComponent';
import {HistoryProps} from './HistoryProps';
import {buildFromUrl} from './route';
import {SearchState} from './SearchState';

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
