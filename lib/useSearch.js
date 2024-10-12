"use strict";
var __assign = (this && this.__assign) || function () {
  __assign = Object.assign || function(t) {
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
var core_1 = require("./core");
var merge_1 = require("./merge");
var reflect_1 = require("./reflect");
var route_1 = require("./route");
var search_1 = require("./search");
var state_1 = require("./state");
var update_1 = require("./update");
exports.callSearch = function (se, search3, showResults3, searchError3, lc, nextPageToken) {
  var s = reflect_1.clone(se);
  var page = se.page;
  if (!page || page < 1) {
    page = 1;
  }
  var offset;
  if (!se.limit || se.limit <= 0) {
    se.limit = 24;
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
  }).catch(function (err) { return err && searchError3(err); });
};
var appendListOfState = function (results, list, setState2) {
  var arr = search_1.append(list, results);
  setState2({ list: arr });
};
var setListOfState = function (list, setState2) {
  setState2({ list: list });
};
function mergeParam(p) {
  if (p) {
    if (!p.sequenceNo) {
      p.sequenceNo = 'sequenceNo';
    }
    if (!p.pageSize) {
      p.pageSize = 24;
    }
    if (!p.pageSizes) {
      p.pageSizes = core_1.pageSizes;
    }
    if (!p.pageMaxSize || p.pageMaxSize <= 0) {
      p.pageMaxSize = 7;
    }
    if (p.hideFilter === undefined) {
      p.hideFilter = true;
    }
    return p;
  }
  else {
    return {
      sequenceNo: 'sequenceNo',
      pageSize: 24,
      pageSizes: core_1.pageSizes,
      pageMaxSize: 7,
      hideFilter: true,
    };
  }
}
exports.mergeParam = mergeParam;
exports.useSearch = function (refForm, initialState, service, p2, p) {
  var baseProps = exports.useCoreSearch(refForm, initialState, service, p2, p);
  react_1.useEffect(function () {
    var load = baseProps.load, setState = baseProps.setState, component = baseProps.component, searchError = baseProps.searchError;
    if (refForm) {
      var registerEvents = (p2.ui ? p2.ui.registerEvents : undefined);
      core_1.initForm(refForm.current, registerEvents);
    }
    if (p && p.initialize) {
      p.initialize(load, setState, component);
    }
    else {
      var se = (p && p.createFilter ? p.createFilter() : undefined);
      try {
        var s = search_1.mergeFilter(route_1.buildFromUrl(se), se, component.pageSizes);
        load(s, p2.auto);
      }
      catch (error) {
        searchError(error);
      }
    }
  }, []);
  return __assign({}, baseProps);
};
exports.useSearchOneProps = function (p) {
  return exports.useSearch(p.refForm, p.initialState, p.service, p, p);
};
exports.useSearchOne = function (p) {
  return exports.useCoreSearch(p.refForm, p.initialState, p.service, p, p);
};
exports.useCoreSearch = function (refForm, initialState, service, p1, p2) {
  var p = mergeParam(p2);
  var _a = react_1.useState(), running = _a[0], setRunning = _a[1];
  var _getModelName = function () {
    return core_1.getName('filter', p && p.name ? p.name : undefined);
  };
  var getModelName = (p && p.getModelName ? p.getModelName : _getModelName);
  var baseProps = update_1.useUpdate(initialState, getModelName, p1.getLocale, core_1.getRemoveError(p1));
  var state = baseProps.state, setState = baseProps.setState;
  var _b = react_1.useState(false), rerender = _b[0], setRerender = _b[1];
  react_1.useEffect(function () {
    setRerender(!rerender);
  }, [state]);
  var _getCurrencyCode = function () {
    return refForm && refForm.current ? refForm.current.getAttribute('currency-code') : null;
  };
  var getCurrencyCode = p && p.getCurrencyCode ? p.getCurrencyCode : _getCurrencyCode;
  var _c = merge_1.useMergeState(p), component = _c[0], setComponent = _c[1];
  var toggleFilter = function (event) {
    var x = !component.hideFilter;
    core_1.handleToggle(event.target, !x);
    setComponent({ hideFilter: x });
  };
  var _getFields = function () {
    var fields = component.fields, initFields = component.initFields;
    var fs = search_1.getFieldsFromForm(fields, initFields, refForm.current);
    setComponent({ fields: fs, initFields: true });
    return fs;
  };
  var getFields = p && p.getFields ? p.getFields : _getFields;
  var _getFilter = function (se) {
    if (!se) {
      se = component;
    }
    var keys = p && p.keys ? p.keys : undefined;
    if (!keys && typeof service !== 'function' && service.keys) {
      keys = service.keys();
    }
    var n = getModelName();
    var fs = p && p.fields;
    if (!fs || fs.length <= 0) {
      fs = getFields();
    }
    var obj3 = search_1.getModel(state, n, se, fs, se.excluding);
    return obj3;
  };
  var getFilter = p && p.getFilter ? p.getFilter : _getFilter;
  var _setFilter = function (s) {
    var objSet = {};
    var n = getModelName();
    objSet[n] = s;
    setState(objSet);
  };
  var setFilter = p && p.setFilter ? p.setFilter : _setFilter;
  var _load = function (s, auto) {
    var com = Object.assign({}, component);
    var obj2 = search_1.initFilter(s, com);
    setComponent(com);
    setFilter(obj2);
    var runSearch = doSearch;
    if (auto) {
      setTimeout(function () {
        runSearch(obj2, true);
      }, 0);
    }
  };
  var load = p && p.load ? p.load : _load;
  var doSearch = function (se, isFirstLoad) {
    core_1.removeFormError(p1, refForm.current);
    var s = getFilter(se);
    if (isFirstLoad) {
      setState(state);
    }
    var isStillRunning = running;
    validateSearch(s, function () {
      if (isStillRunning === true) {
        return;
      }
      setRunning(true);
      core_1.showLoading(p1.loading);
      if (p && !p.ignoreUrlParam) {
        search_1.addParametersIntoUrl(s, isFirstLoad);
      }
      var lc = p1.getLocale ? p1.getLocale() : state_1.enLocale;
      if (typeof service === 'function') {
        exports.callSearch(s, service, showResults, searchError, lc, se.nextPageToken);
      }
      else {
        exports.callSearch(s, service.search, showResults, searchError, lc, se.nextPageToken);
      }
    });
  };
  var _validateSearch = function (se, callback) {
    search_1.validate(se, callback, refForm.current, (p1.getLocale ? p1.getLocale() : undefined), core_1.getValidateForm(p1));
  };
  var validateSearch = p && p.validateSearch ? p.validateSearch : _validateSearch;
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
  var clearQ = function (e) {
    if (e) {
      e.preventDefault();
    }
    var n = getModelName();
    if (n && n.length > 0) {
      var m = state[n];
      if (m) {
        m.q = '';
        var setObj = {};
        setObj[n] = m;
        setState(setObj);
        return;
      }
    }
  };
  var search = function (event) {
    if (event) {
      event.preventDefault();
    }
    resetAndSearch();
  };
  var sort = function (event) {
    event.preventDefault();
    if (event && event.target) {
      var target = event.target;
      var s = search_1.handleSort(target, component.sortTarget, component.sortField, component.sortType);
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
    search_1.removeSortStatus(component.sortTarget);
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
    core_1.error(err, p1.resource.value, p1.showError);
    core_1.hideLoading(p1.loading);
  };
  var appendList = (p && p.appendList ? p.appendList : appendListOfState);
  var setList = (p && p.setList ? p.setList : setListOfState);
  var _showResults = function (s, sr, lc) {
    if (sr === undefined) {
      return;
    }
    var results = (sr === null || sr === void 0 ? void 0 : sr.list) || [];
    if (results && results.length > 0) {
      search_1.formatResults(results, component.pageIndex, component.pageSize, component.pageSize, p ? p.sequenceNo : undefined, p ? p.format : undefined, lc);
    }
    var am = component.appendMode;
    var pi = (s.page && s.page >= 1 ? s.page : 1);
    setComponent({ total: sr.total, pageIndex: pi, nextPageToken: sr.next });
    if (am) {
      var limit = s.limit;
      if ((!s.page || s.page <= 1) && s.firstLimit && s.firstLimit > 0) {
        limit = s.firstLimit;
      }
      search_1.handleAppend(component, sr.list, limit, sr.next);
      if (component.append && (s.page && s.page > 1)) {
        appendList(results, component.list, setState);
      }
      else {
        setList(results, setState);
      }
    }
    else {
      search_1.showPaging(component, sr.list, s.limit, sr.total);
      setList(results, setState);
      setComponent({ tmpPageIndex: s.page });
      if (s.limit) {
        var m1 = search_1.buildMessage(p1.resource, s.page, s.limit, sr.list, sr.total);
        p1.showMessage(m1);
      }
    }
    setRunning(false);
    core_1.hideLoading(p1.loading);
    if (component.triggerSearch) {
      setComponent({ triggerSearch: false });
      resetAndSearch();
    }
  };
  var showResults = (p && p.showResults ? p.showResults : _showResults);
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
    var page = data.page, size = data.size;
    setComponent({ pageIndex: page, pageSize: size, append: false });
    component.pageIndex = page;
    component.pageSize = size;
    component.append = false;
    doSearch(component);
  };
  return __assign(__assign({}, baseProps), { running: running,
    setRunning: setRunning,
    getCurrencyCode: getCurrencyCode, resource: p1.resource.resource(), setComponent: setComponent,
    component: component, showMessage: p1.showMessage, load: load,
    search: search,
    sort: sort,
    changeView: changeView,
    showMore: showMore,
    toggleFilter: toggleFilter,
    doSearch: doSearch,
    pageChanged: pageChanged,
    pageSizeChanged: pageSizeChanged,
    clearQ: clearQ,
    showResults: showResults,
    getFields: getFields,
    getModelName: getModelName, format: p ? p.format : undefined, searchError: searchError });
};
