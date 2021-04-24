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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
          if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
          if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
          if (t[2]) _.ops.pop();
          _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var search_utilities_1 = require("search-utilities");
var base_1 = require("./base");
var core_1 = require("./core");
var merge_1 = require("./merge");
var route_1 = require("./route");
var router_1 = require("./router");
function prepareData(data) {
}
exports.pageSizes = [10, 20, 40, 60, 100, 200, 400, 800];
exports.useSearch = function (refForm, initialState, search, p1, p2, p3) {
  var baseProps = exports.useBaseSearchProps(null, refForm, initialState, search, p1, p2, p3);
  react_1.useEffect(function () {
    var load = baseProps.load, setState = baseProps.setState, component = baseProps.component;
    if (refForm) {
      var registerEvents = (p1.ui ? p1.ui.registerEvents : null);
      core_1.initForm(refForm.current, registerEvents);
    }
    if (p2.initialize) {
      p2.initialize(load, setState, component);
    }
    else {
      var se = (p2.createSearchModel ? p2.createSearchModel() : null);
      var s = search_utilities_1.mergeSearchModel(route_1.buildFromUrl(), se, component.pageSizes);
      load(s, p1.auto);
    }
  }, []);
  return __assign({}, baseProps);
};
exports.useSearchOneProps = function (p) {
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
exports.useBaseSearch = function (refForm, initialState, search, p1, p2, p3) {
  return exports.useBaseSearchProps(null, refForm, initialState, search, p1, p2, p3);
};
exports.useBaseSearchProps = function (props, refForm, initialState, search, p1, p2, p3) {
  var sequenceNo = 'sequenceNo';
  if (p2 && p2.sequenceNo) {
    sequenceNo = p2.sequenceNo;
  }
  var keys = p2.keys;
  if (!keys && typeof search !== 'function') {
    keys = search.keys();
  }
  var p = {
    props: props,
    refForm: refForm,
    initialState: initialState,
    search: search,
    resourceService: p1.resource,
    showMessage: p1.showMessage,
    showError: p1.showError,
    getLocale: p1.getLocale,
    autoSearch: p1.auto,
    keys: keys,
    sequenceNo: sequenceNo,
  };
  var per = (p3 ? p3 : p2);
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
      var u = p1.ui;
      p.decodeFromForm = (p2.decodeFromForm ? p2.decodeFromForm : u.decodeFromForm);
      p.registerEvents = (p2.registerEvents ? p2.registerEvents : u.registerEvents);
      p.validateForm = (p2.validateForm ? p2.validateForm : u.validateForm);
      p.removeFormError = (p2.removeFormError ? p2.removeFormError : u.removeFormError);
      p.removeError = (p2.removeError ? p2.removeError : u.removeError);
    }
    if (p1.loading) {
      var l = p1.loading;
      p.showLoading = (l ? l.showLoading : p1.loading.showLoading);
      p.hideLoading = (l ? l.hideLoading : p1.loading.hideLoading);
    }
  }
  else {
    if (p1.ui) {
      var u = p1.ui;
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
    p.pageSizes = exports.pageSizes;
  }
  if (!p.pageMaxSize) {
    p.pageMaxSize = 7;
  }
  return exports.useBaseSearchOne(p);
};
exports.useBaseSearchOne = function (p) {
  var _a = react_1.useState(undefined), running = _a[0], setRunning = _a[1];
  var _b = p.viewable, viewable = _b === void 0 ? true : _b, _c = p.addable, addable = _c === void 0 ? true : _c, _d = p.editable, editable = _d === void 0 ? true : _d;
  var _getModelName = function () {
    return 'model';
  };
  var getModelName = (p.getModelName ? p.getModelName : _getModelName);
  var baseProps = (p.props ? base_1.useBaseProps(p.props, p.initialState, p.getLocale, p.removeError, getModelName, p.prepareCustomData) : base_1.useBase(p.initialState, p.getLocale, p.removeError, getModelName));
  var state = baseProps.state, setState = baseProps.setState;
  var _e = router_1.useRouter(), match = _e.match, push = _e.push;
  var _getCurrencyCode = function () {
    return p.refForm && p.refForm.current ? p.refForm.current.getAttribute('currency-code') : null;
  };
  var getCurrencyCode = p.getCurrencyCode ? p.getCurrencyCode : _getCurrencyCode;
  var prepareCustomData = (p.prepareCustomData ? p.prepareCustomData : prepareData);
  var updateDateState = function (name, value) {
    var _a, _b, _c, _d, _e, _f, _g;
    var modelName = getModelName();
    var currentState = state[modelName];
    if (p.props.setGlobalState) {
      var data = p.props.shouldBeCustomized ? prepareCustomData((_a = {}, _a[name] = value, _a)) : (_b = {}, _b[name] = value, _b);
      p.props.setGlobalState((_c = {}, _c[modelName] = __assign(__assign({}, currentState), data), _c));
    }
    else {
      setState((_d = {}, _d[modelName] = __assign(__assign({}, currentState), (_e = {}, _e[name] = value, _e)), _d));
    }
    setState((_f = {}, _f[modelName] = __assign(__assign({}, currentState), (_g = {}, _g[name] = value, _g)), _f));
  };
  var p2 = {
    model: {},
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
    viewable: viewable,
    addable: addable,
    editable: editable,
    deletable: p.deletable,
    approvable: p.approvable,
    isFirstTime: true
  };
  var _f = merge_1.useMergeState(p2), component = _f[0], setComponent = _f[1];
  var toggleFilter = function (event) {
    setComponent({ hideFilter: !component.hideFilter });
  };
  var add = function (event) {
    event.preventDefault();
    push(match.url + '/add');
  };
  var _getDisplayFields = function () {
    var displayFields = component.displayFields, initDisplayFields = component.initDisplayFields;
    var fs = search_utilities_1.getDisplayFieldsFromForm(displayFields, initDisplayFields, p.refForm.current);
    setComponent({ displayFields: fs, initDisplayFields: true });
    return fs;
  };
  var getDisplayFields = p.getDisplayFields ? p.getDisplayFields : _getDisplayFields;
  var getSearchModel = function () {
    var n = getModelName();
    var fs = getDisplayFields();
    var lc = p.getLocale();
    var cc = getCurrencyCode();
    var obj3 = search_utilities_1.getModel(state, n, component, fs, component.excluding, component.keys, component.list, p.refForm.current, p.decodeFromForm, lc, cc);
    return obj3;
  };
  var _setSearchModel = function (s) {
    var objSet = {};
    var n = getModelName();
    objSet[n] = s;
    setState(objSet);
  };
  var _load = function (s, auto) {
    var com = Object.assign({}, component);
    var obj2 = search_utilities_1.initSearchable(s, com);
    setComponent(com);
    setSearchModel(obj2);
    var runSearch = doSearch;
    if (auto) {
      setTimeout(function () {
        runSearch(true);
      }, 0);
    }
  };
  var load = p.load ? p.load : _load;
  var setSearchModel = p.setSearchModel ? p.setSearchModel : _setSearchModel;
  var doSearch = function (isFirstLoad) {
    var f = p.refForm.current;
    if (f && p.removeFormError) {
      p.removeFormError(f);
    }
    var s = getSearchModel();
    var isStillRunning = running;
    validateSearch(s, function () {
      if (isStillRunning === true) {
        return;
      }
      setRunning(true);
      if (p.showLoading) {
        p.showLoading();
      }
      if (!component.ignoreUrlParam) {
        search_utilities_1.addParametersIntoUrl(s, isFirstLoad);
      }
      call(s);
    });
  };
  var _validateSearch = function (se, callback) {
    search_utilities_1.validate(se, callback, p.refForm.current, p.getLocale(), p.validateForm);
  };
  var validateSearch = p.validateSearch ? p.validateSearch : _validateSearch;
  var pageSizeChanged = function (event) {
    var size = parseInt(event.currentTarget.value, 10);
    setComponent({
      initPageSize: size,
      pageSize: size,
      pageIndex: 1
    });
    setComponent({ tmpPageIndex: 1, isFirstTime: false });
  };
  var clearKeyworkOnClick = function () {
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
    setState({
      keyword: ''
    });
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
    }
    if (!component.appendMode) {
      doSearch();
    }
    else {
      resetAndSearch();
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
    doSearch();
  };
  var searchError = function (err) {
    setComponent({ pageIndex: component.tmpPageIndex });
    core_1.error(err, p.resourceService.value, p.showError);
  };
  var _appendList = function (results) {
    var _a;
    var list = state.results;
    var arr = search_utilities_1.append(list, results);
    if (p.props) {
      var listForm = p.refForm.current;
      var setGlobalState = p.props.setGlobalState;
      if (setGlobalState && listForm) {
        setGlobalState((_a = {}, _a[listForm.name] = arr, _a));
        return;
      }
    }
    setState({ list: arr });
  };
  var appendList = (p.appendList ? p.appendList : _appendList);
  var _setList = function (list) {
    var _a;
    if (p.props) {
      var setGlobalState = p.props.setGlobalState;
      setComponent({ list: list });
      if (setGlobalState) {
        var listForm = p.refForm.current;
        if (listForm) {
          setGlobalState((_a = {}, _a[listForm.name] = list, _a));
          return;
        }
      }
    }
    setState({ list: list });
  };
  var setList = (p.setList ? p.setList : _setList);
  var _showResults = function (s, sr) {
    var results = sr.results;
    if (results && results.length > 0) {
      var lc = p.getLocale();
      search_utilities_1.formatResults(results, p.pageIndex, p.pageSize, p.initPageSize, p.sequenceNo, p.format, lc);
    }
    var am = component.appendMode;
    search_utilities_1.showResults(s, sr, component);
    if (!am) {
      setList(results);
      setComponent({ tmpPageIndex: s.page });
      var m1 = search_utilities_1.buildSearchMessage(s, sr, p.resourceService);
      p.showMessage(m1);
    }
    else {
      if (component.append && s.page > 1) {
        appendList(results);
      }
      else {
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
  var showResults = (p.showResults ? p.showResults : _showResults);
  var showMore = function (event) {
    event.preventDefault();
    setComponent({ append: true, pageIndex: component.pageIndex + 1 });
    setComponent({ tmpPageIndex: component.pageIndex });
    doSearch();
  };
  var pageChanged = function (data) {
    var currentPage = data.currentPage, itemsPerPage = data.itemsPerPage;
    setComponent({ pageIndex: currentPage, pageSize: itemsPerPage, append: false });
    setComponent({ isFirstTime: false });
  };
  var call = function (s) { return __awaiter(void 0, void 0, void 0, function () {
    var ctx, sr, sr, err_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 5, , 6]);
          ctx = {};
          if (!(typeof p.search === 'function')) return [3, 2];
          return [4, p.search(s, ctx)];
        case 1:
          sr = _a.sent();
          showResults(s, sr);
          return [3, 4];
        case 2: return [4, p.search.search(s, ctx)];
        case 3:
          sr = _a.sent();
          showResults(s, sr);
          _a.label = 4;
        case 4: return [3, 6];
        case 5:
          err_1 = _a.sent();
          searchError(err_1);
          return [3, 6];
        case 6: return [2];
      }
    });
  }); };
  return __assign(__assign({}, baseProps), { running: running,
    setRunning: setRunning,
    getCurrencyCode: getCurrencyCode,
    updateDateState: updateDateState, resource: p.resourceService.resource(), setComponent: setComponent,
    component: component, showMessage: p.showMessage, load: load,
    add: add,
    searchOnClick: searchOnClick,
    sort: sort,
    showMore: showMore,
    toggleFilter: toggleFilter,
    doSearch: doSearch,
    pageChanged: pageChanged,
    pageSizeChanged: pageSizeChanged,
    clearKeyworkOnClick: clearKeyworkOnClick,
    showResults: showResults,
    getDisplayFields: getDisplayFields,
    getModelName: getModelName, format: p.format });
};
