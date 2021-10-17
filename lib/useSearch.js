"use strict";
var __assign = (this && this.__assign) || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var reflectx_1 = require("reflectx");
var search_utilities_1 = require("search-utilities");
var core_1 = require("./core");
var merge_1 = require("./merge");
var route_1 = require("./route");
var update_1 = require("./update");
function prepareData(data) {
}
exports.callSearch = function (se, search3, showResults3, searchError3, lc, nextPageToken) {
  var s = reflectx_1.clone(se);
  var page = se.page;
  if (!page || page < 1) {
    page = 1;
  }
  var offset;
  if (!se.limit || se.limit <= 0) {
    se.limit = 20;
  }
  if (se.firstLimit && se.firstLimit > 0) {
    offset = se.limit * (page - 2) + se.firstLimit;
  }
  else {
    offset = se.limit * (page - 1);
  }
  var limit = (page <= 1 && se.firstLimit && se.firstLimit > 0 ? se.firstLimit : se.limit);
  var next = (nextPageToken && nextPageToken.length > 0 ? nextPageToken : offset);
  var fields = se.fields;
  delete se['page'];
  delete se['fields'];
  delete se['limit'];
  delete se['firstLimit'];
  search3(s, limit, next, fields).then(function (sr) {
    showResults3(s, sr, lc);
  }).catch(function (err) { return searchError3(err); });
};
var appendListOfState = function (results, list, setState2) {
  var arr = search_utilities_1.append(list, results);
  setState2({ list: arr });
};
var setListOfState = function (list, setState2) {
  setState2({ list: list });
};
exports.pageSizes = [10, 20, 40, 60, 100, 200, 400, 800];
function createSearchComponentState(p, p2) {
  var p3 = {
    model: {},
    pageIndex: p.pageIndex,
    pageSize: p.pageSize,
    initPageSize: p.initPageSize,
    pageSizes: p.pageSizes,
    appendMode: p.appendMode,
    displayFields: p.displayFields,
    pageMaxSize: (p.pageMaxSize && p.pageMaxSize > 0 ? p.pageMaxSize : 7)
  };
  if (p2) {
    p3.viewable = p2.viewable;
    p3.addable = p2.addable;
    p3.editable = p2.editable;
    p3.deletable = p2.deletable;
    p3.approvable = p2.approvable;
  }
  else {
    p3.viewable = true;
    p3.addable = true;
    p3.editable = true;
  }
  return p3;
}
function mergeParam(p, ui, loading) {
  if (!p.sequenceNo) {
    p.sequenceNo = 'sequenceNo';
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
    p.pageSizes = exports.pageSizes;
  }
  if (!p.pageMaxSize) {
    p.pageMaxSize = 7;
  }
  if (ui) {
    if (!p.decodeFromForm) {
      p.decodeFromForm = ui.decodeFromForm;
    }
    if (!p.registerEvents) {
      p.registerEvents = ui.registerEvents;
    }
    if (!p.validateForm) {
      p.validateForm = ui.validateForm;
    }
    if (!p.removeFormError) {
      p.removeFormError = ui.removeFormError;
    }
    if (!p.removeError) {
      p.removeError = ui.removeError;
    }
  }
  if (loading) {
    if (!p.showLoading) {
      p.showLoading = loading.showLoading;
    }
    if (!p.hideLoading) {
      p.hideLoading = loading.hideLoading;
    }
  }
}
exports.useSearch = function (refForm, initialState, search, p1, p2, p3) {
  var baseProps = exports.useBaseSearchWithProps(null, refForm, initialState, search, p1, p2, p3);
  react_1.useEffect(function () {
    var load = baseProps.load, setState = baseProps.setState, component = baseProps.component;
    if (refForm) {
      var registerEvents = (p2.ui ? p2.ui.registerEvents : null);
      core_1.initForm(refForm.current, registerEvents);
    }
    if (p1.initialize) {
      p1.initialize(load, setState, component);
    }
    else {
      var se = (p1.createSearchModel ? p1.createSearchModel() : null);
      var s = search_utilities_1.mergeSearchModel(route_1.buildFromUrl(), se, component.pageSizes);
      load(s, p2.auto);
    }
  }, []);
  return __assign({}, baseProps);
};
exports.useSearchOneWithProps = function (p) {
  var baseProps = exports.useBaseSearchOne(p);
  react_1.useEffect(function () {
    var load = baseProps.load, setState = baseProps.setState, component = baseProps.component;
    if (p.refForm) {
      core_1.initForm(p.refForm.current, p.registerEvents);
    }
    if (p.initialize) {
      p.initialize(load, setState, component);
    }
    else {
      var se = (p.createSearchModel ? p.createSearchModel() : null);
      var s = search_utilities_1.mergeSearchModel(route_1.buildFromUrl(), se, component.pageSizes);
      load(s, p.autoSearch);
    }
  }, []);
  return __assign({}, baseProps);
};
exports.useBaseSearchOne = function (p, p2) {
  return exports.useBaseSearchWithProps(p.props, p.refForm, p.initialState, p.search, p, p, p2);
};
exports.useBaseSearch = function (refForm, initialState, search, p1, p2, p3) {
  return exports.useBaseSearchWithProps(null, refForm, initialState, search, p1, p2, p3);
};
exports.useBaseSearchWithProps = function (props, refForm, initialState, search, p1, p2, p3) {
  mergeParam(p1, p2.ui, p2.loading);
  var _a = react_1.useState(undefined), running = _a[0], setRunning = _a[1];
  var _getModelName = function () {
    if (p1.name && p1.name.length > 0) {
      return p1.name;
    }
    else {
      return 'model';
    }
  };
  var getModelName = (p1.getModelName ? p1.getModelName : _getModelName);
  var baseProps = (props ? update_1.useUpdateWithProps(props, initialState, p2.getLocale, p1.removeError, getModelName, p1.prepareCustomData) : update_1.useUpdate(initialState, getModelName, p2.getLocale, p1.removeError));
  var state = baseProps.state, setState = baseProps.setState;
  var _b = [react_router_dom_1.useHistory(), react_router_dom_1.useRouteMatch()], history = _b[0], match = _b[1];
  var _getCurrencyCode = function () {
    return refForm && refForm.current ? refForm.current.getAttribute('currency-code') : null;
  };
  var getCurrencyCode = p1.getCurrencyCode ? p1.getCurrencyCode : _getCurrencyCode;
  var prepareCustomData = (p1.prepareCustomData ? p1.prepareCustomData : prepareData);
  var updateDateState = function (name, value) {
    var _a, _b, _c, _d, _e, _f, _g;
    var modelName = getModelName();
    var currentState = state[modelName];
    if (props.setGlobalState) {
      var data = props.shouldBeCustomized ? prepareCustomData((_a = {}, _a[name] = value, _a)) : (_b = {}, _b[name] = value, _b);
      props.setGlobalState((_c = {}, _c[modelName] = __assign(__assign({}, currentState), data), _c));
    }
    else {
      setState((_d = {}, _d[modelName] = __assign(__assign({}, currentState), (_e = {}, _e[name] = value, _e)), _d));
    }
    setState((_f = {}, _f[modelName] = __assign(__assign({}, currentState), (_g = {}, _g[name] = value, _g)), _f));
  };
  var p = createSearchComponentState(p1, p3);
  var _c = merge_1.useMergeState(p), component = _c[0], setComponent = _c[1];
  var toggleFilter = function (event) {
    setComponent({ hideFilter: !component.hideFilter });
  };
  var add = function (event) {
    event.preventDefault();
    history.push(match.url + '/add');
  };
  var _getFields = function () {
    var displayFields = component.displayFields, initFields = component.initFields;
    var fs = search_utilities_1.getDisplayFieldsFromForm(displayFields, initFields, refForm.current);
    setComponent({ displayFields: fs, initFields: true });
    return fs;
  };
  var getFields = p1.getFields ? p1.getFields : _getFields;
  var getSearchModel = function (se) {
    if (!se) {
      se = component;
    }
    var keys = p1.keys;
    if (!keys && typeof search !== 'function') {
      keys = search.keys();
    }
    var n = getModelName();
    var fs = p1.displayFields;
    if (!fs || fs.length <= 0) {
      fs = getFields();
    }
    var lc = p2.getLocale();
    var cc = getCurrencyCode();
    var obj3 = search_utilities_1.getModel(state, n, se, fs, se.excluding, keys, se.list, refForm.current, p1.decodeFromForm, lc, cc);
    return obj3;
  };
  var _setSearchModel = function (s) {
    var objSet = {};
    var n = getModelName();
    objSet[n] = s;
    setState(objSet);
  };
  var setSearchModel = p1.setSearchModel ? p1.setSearchModel : _setSearchModel;
  var _load = function (s, auto) {
    var com = Object.assign({}, component);
    var obj2 = search_utilities_1.initSearchable(s, com);
    setComponent(com);
    setSearchModel(obj2);
    var runSearch = doSearch;
    if (auto) {
      setTimeout(function () {
        runSearch(com, true);
      }, 0);
    }
  };
  var load = p1.load ? p1.load : _load;
  var doSearch = function (se, isFirstLoad) {
    var f = refForm.current;
    if (f && p1.removeFormError) {
      p1.removeFormError(f);
    }
    var s = getSearchModel(se);
    var isStillRunning = running;
    validateSearch(s, function () {
      if (isStillRunning === true) {
        return;
      }
      setRunning(true);
      core_1.showLoading(p1.showLoading);
      if (!p1.ignoreUrlParam) {
        search_utilities_1.addParametersIntoUrl(s, isFirstLoad);
      }
      var lc = p2.getLocale();
      if (typeof search === 'function') {
        exports.callSearch(s, search, showResults, searchError, lc, se.nextPageToken);
      }
      else {
        exports.callSearch(s, search.search, showResults, searchError, lc, se.nextPageToken);
      }
    });
  };
  var _validateSearch = function (se, callback) {
    search_utilities_1.validate(se, callback, refForm.current, p2.getLocale(), p1.validateForm);
  };
  var validateSearch = p1.validateSearch ? p1.validateSearch : _validateSearch;
  var pageSizeChanged = function (event) {
    var size = parseInt(event.currentTarget.value, 10);
    component.pageSize = size;
    component.pageIndex = 1;
    component.tmpPageIndex = 1;
    setComponent({
      pageSize: size,
      pageIndex: 1,
      tmpPageIndex: 1
    });
    doSearch(component);
  };
  var clearKeyworkOnClick = function (event) {
    var n = getModelName();
    if (n && n.length > 0) {
      var m = state[n];
      if (m) {
        m.keyword = '';
        var setObj = {};
        setObj[n] = m;
        setState(setObj);
        return;
      }
    }
  };
  var searchOnClick = function (event) {
    if (event) {
      event.preventDefault();
    }
    resetAndSearch();
  };
  var sort = function (event) {
    event.preventDefault();
    if (event && event.target) {
      var target = event.target;
      var s = search_utilities_1.handleSort(target, component.sortTarget, component.sortField, component.sortType);
      setComponent({
        sortField: s.field,
        sortType: s.type,
        sortTarget: target
      });
      component.sortField = s.field;
      component.sortType = s.type;
      component.sortTarget = target;
    }
    if (!component.appendMode) {
      doSearch(component);
    }
    else {
      resetAndSearch();
    }
  };
  var changeView = function (event, view) {
    if (view && view.length > 0) {
      setComponent({ view: view });
    }
    else if (event && event.target) {
      var target = event.target;
      var v = target.getAttribute('data-view');
      if (v && v.length > 0) {
        setComponent({ view: v });
      }
    }
  };
  var resetAndSearch = function () {
    if (running === true) {
      setComponent({ pageIndex: 1, triggerSearch: true });
      return;
    }
    setComponent({ pageIndex: 1, tmpPageIndex: 1 });
    search_utilities_1.removeSortStatus(component.sortTarget);
    setComponent({
      sortTarget: null,
      sortField: null,
      append: false,
      pageIndex: 1
    });
    component.sortTarget = null;
    component.sortField = null;
    component.append = false;
    component.pageIndex = 1;
    doSearch(component);
  };
  var searchError = function (err) {
    setComponent({ pageIndex: component.tmpPageIndex });
    core_1.error(err, p2.resource.value, p2.showError);
  };
  var appendList = (p1.appendList ? p1.appendList : appendListOfState);
  var setList = (p1.setList ? p1.setList : setListOfState);
  var _showResults = function (s, sr, lc) {
    var results = sr.list;
    if (results && results.length > 0) {
      search_utilities_1.formatResults(results, component.pageIndex, component.pageSize, component.initPageSize, p1.sequenceNo, p1.format, lc);
    }
    var am = component.appendMode;
    var pi = (s.page && s.page >= 1 ? s.page : 1);
    setComponent({ itemTotal: sr.total, pageIndex: pi, nextPageToken: sr.nextPageToken });
    if (am) {
      var limit = s.limit;
      if (s.page <= 1 && s.firstLimit && s.firstLimit > 0) {
        limit = s.firstLimit;
      }
      search_utilities_1.handleAppend(component, limit, sr.list, sr.nextPageToken);
      if (component.append && s.page > 1) {
        appendList(results, component.list, setState);
      }
      else {
        setList(results, setState);
      }
    }
    else {
      search_utilities_1.showPaging(component, s.limit, sr.list, sr.total);
      setList(results, setState);
      setComponent({ tmpPageIndex: s.page });
      var m1 = search_utilities_1.buildSearchMessage(p2.resource, s.page, s.limit, sr.list, sr.total);
      p2.showMessage(m1);
    }
    setRunning(false);
    core_1.hideLoading(p1.hideLoading);
    if (component.triggerSearch) {
      setComponent({ triggerSearch: false });
      resetAndSearch();
    }
  };
  var showResults = (p1.showResults ? p1.showResults : _showResults);
  var showMore = function (event) {
    event.preventDefault();
    var n = component.pageIndex + 1;
    var m = component.pageIndex;
    setComponent({ tmpPageIndex: m, pageIndex: n, append: true });
    component.tmpPageIndex = m;
    component.pageIndex = n;
    component.append = true;
    doSearch(component);
  };
  var pageChanged = function (data) {
    var currentPage = data.currentPage, itemsPerPage = data.itemsPerPage;
    setComponent({ pageIndex: currentPage, pageSize: itemsPerPage, append: false });
    component.pageIndex = currentPage;
    component.pageSize = itemsPerPage;
    component.append = false;
    doSearch(component);
  };
  return __assign(__assign({}, baseProps), {
    running: running,
    setRunning: setRunning,
    getCurrencyCode: getCurrencyCode,
    updateDateState: updateDateState, resource: p2.resource.resource(), setComponent: setComponent,
    component: component, showMessage: p2.showMessage, load: load,
    add: add,
    searchOnClick: searchOnClick,
    sort: sort,
    changeView: changeView,
    showMore: showMore,
    toggleFilter: toggleFilter,
    doSearch: doSearch,
    pageChanged: pageChanged,
    pageSizeChanged: pageSizeChanged,
    clearKeyworkOnClick: clearKeyworkOnClick,
    showResults: showResults,
    getFields: getFields,
    getModelName: getModelName, format: p1.format
  });
};
