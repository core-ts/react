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
var state_1 = require("./state");
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
function mergeParam(p) {
  if (p) {
    if (!p.sequenceNo) {
      p.sequenceNo = 'sequenceNo';
    }
    if (!p.pageSize) {
      p.pageSize = 20;
    }
    if (!p.pageSizes) {
      p.pageSizes = exports.pageSizes;
    }
    if (!p.pageMaxSize || p.pageMaxSize <= 0) {
      p.pageMaxSize = 7;
    }
  }
}
exports.useSearch = function (refForm, initialState, search, p2, p) {
  var baseProps = exports.useCoreSearch(undefined, refForm, initialState, search, p2, p);
  react_1.useEffect(function () {
    var load = baseProps.load, setState = baseProps.setState, component = baseProps.component;
    if (refForm) {
      var registerEvents = (p2.ui ? p2.ui.registerEvents : undefined);
      core_1.initForm(refForm.current, registerEvents);
    }
    if (p && p.initialize) {
      p.initialize(load, setState, component);
    }
    else {
      var se = (p && p.createFilter ? p.createFilter() : undefined);
      var s = search_utilities_1.mergeFilter(route_1.buildFromUrl(), se, component.pageSizes);
      load(s, p2.auto);
    }
  }, []);
  return __assign({}, baseProps);
};
exports.useSearchOneProps = function (p) {
  return exports.useSearch(p.refForm, p.initialState, p.search, p, p);
};
exports.useSearchOne = function (p) {
  return exports.useCoreSearch(undefined, p.refForm, p.initialState, p.search, p, p);
};
exports.useCoreSearch = function (props, refForm, initialState, search, p2, p1) {
  mergeParam(p1);
  var _a = react_1.useState(), running = _a[0], setRunning = _a[1];
  var _getModelName = function () {
    return core_1.getName('filter', p1 && p1.name ? p1.name : undefined);
  };
  var getModelName = (p1 && p1.getModelName ? p1.getModelName : _getModelName);
  var baseProps = (props ? update_1.useUpdateWithProps(props, initialState, getModelName, p2.getLocale, core_1.getRemoveError(p2), p1 ? p1.prepareCustomData : undefined) : update_1.useUpdate(initialState, getModelName, p2.getLocale, core_1.getRemoveError(p2)));
  var state = baseProps.state, setState = baseProps.setState;
  var _b = [react_router_dom_1.useHistory(), react_router_dom_1.useRouteMatch()], history = _b[0], match = _b[1];
  var _getCurrencyCode = function () {
    return refForm && refForm.current ? refForm.current.getAttribute('currency-code') : null;
  };
  var getCurrencyCode = p1 && p1.getCurrencyCode ? p1.getCurrencyCode : _getCurrencyCode;
  var prepareCustomData = (p1 && p1.prepareCustomData ? p1.prepareCustomData : prepareData);
  var updateDateState = function (name, value) {
    var _a, _b, _c, _d, _e, _f, _g;
    var modelName = getModelName();
    var currentState = state[modelName];
    if (props && props.setGlobalState) {
      var data = props.shouldBeCustomized ? prepareCustomData((_a = {}, _a[name] = value, _a)) : (_b = {}, _b[name] = value, _b);
      props.setGlobalState((_c = {}, _c[modelName] = __assign(__assign({}, currentState), data), _c));
    }
    else {
      setState((_d = {}, _d[modelName] = __assign(__assign({}, currentState), (_e = {}, _e[name] = value, _e)), _d));
    }
    setState((_f = {}, _f[modelName] = __assign(__assign({}, currentState), (_g = {}, _g[name] = value, _g)), _f));
  };
  var _c = merge_1.useMergeState(p1), component = _c[0], setComponent = _c[1];
  var toggleFilter = function (event) {
    setComponent({ hideFilter: !component.hideFilter });
  };
  var add = function (event) {
    event.preventDefault();
    history.push(match.url + '/add');
  };
  var _getFields = function () {
    var fields = component.fields, initFields = component.initFields;
    var fs = search_utilities_1.getFieldsFromForm(fields, initFields, refForm.current);
    setComponent({ fields: fs, initFields: true });
    return fs;
  };
  var getFields = p1 && p1.getFields ? p1.getFields : _getFields;
  var getFilter = function (se) {
    if (!se) {
      se = component;
    }
    var keys = p1 && p1.keys ? p1.keys : undefined;
    if (!keys && typeof search !== 'function' && search.keys) {
      keys = search.keys();
    }
    var n = getModelName();
    var fs = p1 && p1.fields;
    if (!fs || fs.length <= 0) {
      fs = getFields();
    }
    var lc = (p2.getLocale ? p2.getLocale() : state_1.enLocale);
    var cc = getCurrencyCode();
    var obj3 = search_utilities_1.getModel(state, n, se, fs, se.excluding, keys, se.list, refForm.current, core_1.getDecodeFromForm(p2), lc, cc);
    return obj3;
  };
  var _setFilter = function (s) {
    var objSet = {};
    var n = getModelName();
    objSet[n] = s;
    setState(objSet);
  };
  var setFilter = p1 && p1.setFilter ? p1.setFilter : _setFilter;
  var _load = function (s, auto) {
    var com = Object.assign({}, component);
    var obj2 = search_utilities_1.initFilter(s, com);
    setComponent(com);
    setFilter(obj2);
    var runSearch = doSearch;
    if (auto) {
      setTimeout(function () {
        runSearch(com, true);
      }, 0);
    }
  };
  var load = p1 && p1.load ? p1.load : _load;
  var doSearch = function (se, isFirstLoad) {
    core_1.removeFormError(p2, refForm.current);
    var s = getFilter(se);
    var isStillRunning = running;
    validateSearch(s, function () {
      if (isStillRunning === true) {
        return;
      }
      setRunning(true);
      core_1.showLoading(p2.loading);
      if (p1 && !p1.ignoreUrlParam) {
        search_utilities_1.addParametersIntoUrl(s, isFirstLoad);
      }
      var lc = p2.getLocale ? p2.getLocale() : state_1.enLocale;
      if (typeof search === 'function') {
        exports.callSearch(s, search, showResults, searchError, lc, se.nextPageToken);
      }
      else {
        exports.callSearch(s, search.search, showResults, searchError, lc, se.nextPageToken);
      }
    });
  };
  var _validateSearch = function (se, callback) {
    search_utilities_1.validate(se, callback, refForm.current, (p2.getLocale ? p2.getLocale() : undefined), core_1.getValidateForm(p2));
  };
  var validateSearch = p1 && p1.validateSearch ? p1.validateSearch : _validateSearch;
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
  var clearQ = function (event) {
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
      sortTarget: undefined,
      sortField: undefined,
      append: false,
      pageIndex: 1
    });
    component.sortTarget = undefined;
    component.sortField = undefined;
    component.append = false;
    component.pageIndex = 1;
    doSearch(component);
  };
  var searchError = function (err) {
    setComponent({ pageIndex: component.tmpPageIndex });
    core_1.error(err, p2.resource.value, p2.showError);
  };
  var appendList = (p1 && p1.appendList ? p1.appendList : appendListOfState);
  var setList = (p1 && p1.setList ? p1.setList : setListOfState);
  var _showResults = function (s, sr, lc) {
    var results = sr.list;
    if (results && results.length > 0) {
      search_utilities_1.formatResults(results, component.pageIndex, component.pageSize, component.initPageSize, p1 ? p1.sequenceNo : undefined, p1 ? p1.format : undefined, lc);
    }
    var am = component.appendMode;
    var pi = (s.page && s.page >= 1 ? s.page : 1);
    setComponent({ itemTotal: sr.total, pageIndex: pi, nextPageToken: sr.nextPageToken });
    if (am) {
      var limit = s.limit;
      if ((!s.page || s.page <= 1) && s.firstLimit && s.firstLimit > 0) {
        limit = s.firstLimit;
      }
      search_utilities_1.handleAppend(component, sr.list, limit, sr.nextPageToken);
      if (component.append && (s.page && s.page > 1)) {
        appendList(results, component.list, setState);
      }
      else {
        setList(results, setState);
      }
    }
    else {
      search_utilities_1.showPaging(component, sr.list, s.limit, sr.total);
      setList(results, setState);
      setComponent({ tmpPageIndex: s.page });
      if (s.limit) {
        var m1 = search_utilities_1.buildMessage(p2.resource, s.page, s.limit, sr.list, sr.total);
        p2.showMessage(m1);
      }
    }
    setRunning(false);
    core_1.hideLoading(p2.loading);
    if (component.triggerSearch) {
      setComponent({ triggerSearch: false });
      resetAndSearch();
    }
  };
  var showResults = (p1 && p1.showResults ? p1.showResults : _showResults);
  var showMore = function (event) {
    event.preventDefault();
    var n = component.pageIndex ? component.pageIndex + 1 : 2;
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
    pageSizeChanged: pageSizeChanged, clearKeyworkOnClick: clearQ, showResults: showResults,
    getFields: getFields,
    getModelName: getModelName, format: p1 ? p1.format : undefined
  });
};
