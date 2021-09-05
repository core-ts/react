"use strict";
var __extends = (this && this.__extends) || (function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
  };
  return function (d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
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
  var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
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
var React = require("react");
var reflectx_1 = require("reflectx");
var search_utilities_1 = require("search-utilities");
var core_1 = require("./core");
var edit_1 = require("./edit");
var formutil_1 = require("./formutil");
var input_1 = require("./input");
var route_1 = require("./route");
var state_1 = require("./state");
exports.scrollToFocus = function (e, isUseTimeOut) {
  try {
    var element = e.target;
    var container_1 = element.form.childNodes[1];
    var elementRect_1 = element.getBoundingClientRect();
    var absoluteElementTop = elementRect_1.top + window.pageYOffset;
    var middle_1 = absoluteElementTop - (window.innerHeight / 2);
    var scrollTop_1 = container_1.scrollTop;
    var timeOut = isUseTimeOut ? 300 : 0;
    var isChrome_1 = navigator.userAgent.search('Chrome') > 0;
    setTimeout(function () {
      if (isChrome_1) {
        var scrollPosition = scrollTop_1 === 0 ? (elementRect_1.top + 64) : (scrollTop_1 + middle_1);
        container_1.scrollTo(0, Math.abs(scrollPosition));
      }
      else {
        container_1.scrollTo(0, Math.abs(scrollTop_1 + middle_1));
      }
    }, timeOut);
  }
  catch (e) {
    console.log(e);
  }
};
var ViewComponent = (function (_super) {
  __extends(ViewComponent, _super);
  function ViewComponent(props, sv, param, showError, loading, getLocale) {
    var _this = _super.call(this, props) || this;
    _this.resourceService = input_1.getResource(param);
    _this.resource = _this.resourceService.resource();
    _this.showError = input_1.getErrorFunc(param, showError);
    _this.loading = input_1.getLoadingFunc(param, loading);
    _this.getLocale = input_1.getLocaleFunc(param, getLocale);
    if (sv) {
      if (typeof sv === 'function') {
        _this.loadData = sv;
      }
      else {
        _this.service = sv;
        if (_this.service.metadata) {
          var m = _this.service.metadata();
          if (m) {
            _this.metadata = m;
            var meta = edit_1.build(m);
            _this.keys = meta.keys;
          }
        }
      }
    }
    _this.back = _this.back.bind(_this);
    _this.getModelName = _this.getModelName.bind(_this);
    _this.load = _this.load.bind(_this);
    _this.getModel = _this.getModel.bind(_this);
    _this.showModel = _this.showModel.bind(_this);
    _this.ref = React.createRef();
    return _this;
  }
  ViewComponent.prototype.back = function (event) {
    if (event) {
      event.preventDefault();
    }
    this.props.history.goBack();
  };
  ViewComponent.prototype.getModelName = function () {
    if (this.name && this.name.length > 0) {
      return this.name;
    }
    var n = core_1.getModelName(this.form);
    if (!n || n.length === 0) {
      return 'model';
    }
  };
  ViewComponent.prototype.componentDidMount = function () {
    this.form = this.ref.current;
    var id = core_1.buildId(this.props, this.keys);
    this.load(id);
  };
  ViewComponent.prototype.load = function (_id, callback) {
    return __awaiter(this, void 0, void 0, function () {
      var id, ctx, obj, err_1, data;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            id = _id;
            if (!(id != null && id !== '')) return [3, 8];
            this.running = true;
            if (this.loading) {
              this.loading.showLoading();
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 6, 7, 8]);
            ctx = {};
            obj = void 0;
            if (!this.loadData) return [3, 3];
            return [4, this.loadData(id, ctx)];
          case 2:
            obj = _a.sent();
            return [3, 5];
          case 3: return [4, this.service.load(id, ctx)];
          case 4:
            obj = _a.sent();
            _a.label = 5;
          case 5:
            if (!obj) {
              this.handleNotFound(this.form);
            }
            else {
              if (callback) {
                callback(obj, this.showModel);
              }
              else {
                this.showModel(obj);
              }
            }
            return [3, 8];
          case 6:
            err_1 = _a.sent();
            data = (err_1 && err_1.response) ? err_1.response : err_1;
            if (data && data.status === 404) {
              this.handleNotFound(this.form);
            }
            else {
              core_1.error(err_1, this.resourceService.value, this.showError);
            }
            return [3, 8];
          case 7:
            this.running = false;
            if (this.loading) {
              this.loading.hideLoading();
            }
            return [7];
          case 8: return [2];
        }
      });
    });
  };
  ViewComponent.prototype.handleNotFound = function (form) {
    var msg = core_1.message(this.resourceService.value, 'error_not_found', 'error');
    if (form) {
      formutil_1.readOnly(form);
    }
    this.showError(msg.message, msg.title);
  };
  ViewComponent.prototype.getModel = function () {
    return this.state[this.getModelName()];
  };
  ViewComponent.prototype.showModel = function (model) {
    var modelName = this.getModelName();
    var objSet = {};
    objSet[modelName] = model;
    this.setState(objSet);
  };
  return ViewComponent;
}(React.Component));
exports.ViewComponent = ViewComponent;
var BaseComponent = (function (_super) {
  __extends(BaseComponent, _super);
  function BaseComponent(props, getLocale, removeErr) {
    var _this = _super.call(this, props) || this;
    _this.getLocale = getLocale;
    _this.removeErr = removeErr;
    _this.updatePhoneState = function (event) {
      var re = /^[0-9\b]+$/;
      var target = event.currentTarget;
      var value = core_1.removePhoneFormat(target.value);
      if (re.test(value) || !value) {
        _this.updateState(event);
      }
      else {
        var splitArr = value.split('');
        var responseStr_1 = '';
        splitArr.forEach(function (element) {
          if (re.test(element)) {
            responseStr_1 += element;
          }
        });
        target.value = responseStr_1;
        _this.updateState(event);
      }
    };
    _this.updateDateState = function (name, value) {
      var _a, _b, _c, _d, _e;
      var props = _this.props;
      var modelName = _this.getModelName(_this.form);
      var state = _this.state[modelName];
      if (props.setGlobalState) {
        var data = props.shouldBeCustomized ? _this.prepareCustomData((_a = {}, _a[name] = value, _a)) : (_b = {}, _b[name] = value, _b);
        props.setGlobalState((_c = {}, _c[modelName] = __assign(__assign({}, state), data), _c));
      }
      else {
        var objSet = (_d = {}, _d[modelName] = __assign(__assign({}, state), (_e = {}, _e[name] = value, _e)), _d);
        _this.setState(objSet);
      }
    };
    _this.updateState = function (e, callback, lc) {
      var ctrl = e.currentTarget;
      var modelName = _this.getModelName(ctrl.form);
      var l = state_1.localeOf(lc, _this.getLocale);
      var props = _this.props;
      state_1.handleEvent(e, _this.removeErr);
      if (props.setGlobalState) {
        state_1.handleProps(e, props, ctrl, modelName, l, _this.prepareCustomData);
      }
      else {
        var objSet = state_1.buildState(e, _this.state, ctrl, modelName, l);
        if (objSet) {
          if (callback) {
            _this.setState(objSet, callback);
          }
          else {
            _this.setState(objSet);
          }
        }
      }
    };
    _this.getModelName = _this.getModelName.bind(_this);
    _this.updateState = _this.updateState.bind(_this);
    _this.updateFlatState = _this.updateFlatState.bind(_this);
    _this.updatePhoneState = _this.updatePhoneState.bind(_this);
    _this.updateDateState = _this.updateDateState.bind(_this);
    _this.prepareCustomData = _this.prepareCustomData.bind(_this);
    return _this;
  }
  BaseComponent.prototype.prepareCustomData = function (data) { };
  BaseComponent.prototype.getModelName = function (f) {
    var f2 = f;
    if (!f2) {
      f2 = this.form;
    }
    if (f2) {
      var a = core_1.getModelName(f2);
      if (a && a.length > 0) {
        return a;
      }
    }
    return 'model';
  };
  BaseComponent.prototype.updateFlatState = function (e, callback, lc) {
    var l = state_1.localeOf(lc, this.getLocale);
    var objSet = state_1.buildFlatState(e, this.state, l);
    if (objSet != null) {
      if (callback) {
        this.setState(objSet, callback);
      }
      else {
        this.setState(objSet);
      }
    }
  };
  return BaseComponent;
}(React.Component));
exports.BaseComponent = BaseComponent;
var BaseSearchComponent = (function (_super) {
  __extends(BaseSearchComponent, _super);
  function BaseSearchComponent(props, resourceService, showMessage, getLocale, ui, loading, listFormId) {
    var _this = _super.call(this, props, getLocale, (ui ? ui.removeError : null)) || this;
    _this.resourceService = resourceService;
    _this.showMessage = showMessage;
    _this.ui = ui;
    _this.loading = loading;
    _this.listFormId = listFormId;
    _this.initPageSize = 20;
    _this.pageSize = 20;
    _this.pageIndex = 1;
    _this.itemTotal = 0;
    _this.pageTotal = 0;
    _this.sequenceNo = 'sequenceNo';
    _this.tmpPageIndex = 1;
    _this.pageMaxSize = 7;
    _this.pageSizes = [10, 20, 40, 60, 100, 200, 400, 800];
    _this.viewable = true;
    _this.addable = true;
    _this.editable = true;
    _this.add = function (event) {
      event.preventDefault();
      var url = _this.props['props'].match.url + '/add';
      _this.props.history.push(url);
    };
    _this.pagingOnClick = function (size, e) {
      _this.setState(function (prevState) { return ({ isPageSizeOpenDropDown: !prevState.isPageSizeOpenDropDown }); });
      _this.pageSizeChanged(size);
    };
    _this.pageSizeOnClick = function () {
      _this.setState(function (prevState) { return ({ isPageSizeOpenDropDown: !prevState.isPageSizeOpenDropDown }); });
    };
    _this.pageSizeChanged = function (event) {
      var size = parseInt(event.currentTarget.value, null);
      search_utilities_1.changePageSize(_this, size);
      _this.tmpPageIndex = 1;
      _this.doSearch();
    };
    _this.resource = resourceService.resource();
    _this.getModelName = _this.getModelName.bind(_this);
    _this.showMessage = _this.showMessage.bind(_this);
    _this.toggleFilter = _this.toggleFilter.bind(_this);
    _this.load = _this.load.bind(_this);
    _this.add = _this.add.bind(_this);
    _this.getSearchForm = _this.getSearchForm.bind(_this);
    _this.setSearchForm = _this.setSearchForm.bind(_this);
    _this.setSearchModel = _this.setSearchModel.bind(_this);
    _this.getSearchModel = _this.getSearchModel.bind(_this);
    _this.getDisplayFields = _this.getDisplayFields.bind(_this);
    _this.pageSizeChanged = _this.pageSizeChanged.bind(_this);
    _this.clearKeyword = _this.clearKeyword.bind(_this);
    _this.searchOnClick = _this.searchOnClick.bind(_this);
    _this.resetAndSearch = _this.resetAndSearch.bind(_this);
    _this.doSearch = _this.doSearch.bind(_this);
    _this.call = _this.call.bind(_this);
    _this.validateSearch = _this.validateSearch.bind(_this);
    _this.showResults = _this.showResults.bind(_this);
    _this.setList = _this.setList.bind(_this);
    _this.getList = _this.getList.bind(_this);
    _this.sort = _this.sort.bind(_this);
    _this.showMore = _this.showMore.bind(_this);
    _this.pageChanged = _this.pageChanged.bind(_this);
    _this.url = (props.match ? props.match.url : props['props'].match.url);
    return _this;
  }
  BaseSearchComponent.prototype.getModelName = function () {
    return 'model';
  };
  BaseSearchComponent.prototype.toggleFilter = function (event) {
    this.hideFilter = !this.hideFilter;
  };
  BaseSearchComponent.prototype.load = function (s, autoSearch) {
    var obj2 = search_utilities_1.initSearchable(s, this);
    this.setSearchModel(obj2);
    var com = this;
    if (autoSearch) {
      setTimeout(function () {
        com.doSearch(true);
      }, 0);
    }
  };
  BaseSearchComponent.prototype.setSearchForm = function (form) {
    this.form = form;
  };
  BaseSearchComponent.prototype.getSearchForm = function () {
    if (!this.form && this.listFormId) {
      this.form = document.getElementById(this.listFormId);
    }
    return this.form;
  };
  BaseSearchComponent.prototype.setSearchModel = function (searchModel) {
    this.setState(searchModel);
  };
  BaseSearchComponent.prototype.getCurrencyCode = function () {
    return core_1.getCurrencyCode(this.form);
  };
  BaseSearchComponent.prototype.getSearchModel = function () {
    var name = this.getModelName();
    var lc = this.getLocale();
    var cc = this.getCurrencyCode();
    var fields = this.getDisplayFields();
    var l = this.getList();
    var f = this.getSearchForm();
    var dc = (this.ui ? this.ui.decodeFromForm : null);
    var obj3 = search_utilities_1.getModel(this.state, name, this, fields, this.excluding, this.keys, l, f, dc, lc, cc);
    return obj3;
  };
  BaseSearchComponent.prototype.getDisplayFields = function () {
    var fs = search_utilities_1.getDisplayFieldsFromForm(this.displayFields, this.initDisplayFields, this.form);
    this.initDisplayFields = true;
    return fs;
  };
  BaseSearchComponent.prototype.clearKeyword = function () {
    var m = this.state.model;
    if (m) {
      m.q = '';
      this.setState({ model: m });
    }
    else {
      this.setState({
        q: ''
      });
    }
  };
  BaseSearchComponent.prototype.searchOnClick = function (event) {
    if (event) {
      event.preventDefault();
      if (!this.getSearchForm()) {
        var f = event.target.form;
        if (f) {
          this.setSearchForm(f);
        }
      }
    }
    this.resetAndSearch();
  };
  BaseSearchComponent.prototype.resetAndSearch = function () {
    this.pageIndex = 1;
    if (this.running === true) {
      this.triggerSearch = true;
      return;
    }
    search_utilities_1.reset(this);
    this.tmpPageIndex = 1;
    this.doSearch();
  };
  BaseSearchComponent.prototype.doSearch = function (isFirstLoad) {
    var _this = this;
    var listForm = this.getSearchForm();
    if (listForm && this.ui) {
      this.ui.removeFormError(listForm);
    }
    var s = this.getSearchModel();
    var com = this;
    this.validateSearch(s, function () {
      if (com.running === true) {
        return;
      }
      com.running = true;
      if (_this.loading) {
        _this.loading.showLoading();
      }
      if (!_this.ignoreUrlParam) {
        search_utilities_1.addParametersIntoUrl(s, isFirstLoad);
      }
      com.call(s);
    });
  };
  BaseSearchComponent.prototype.call = function (s) {
  };
  BaseSearchComponent.prototype.validateSearch = function (se, callback) {
    var u = this.ui;
    var vl = (u ? u.validateForm : null);
    search_utilities_1.validate(se, callback, this.getSearchForm(), this.getLocale(), vl);
  };
  BaseSearchComponent.prototype.showResults = function (s, sr) {
    var com = this;
    var results = sr.list;
    if (results && results.length > 0) {
      var lc = this.getLocale();
      search_utilities_1.formatResultsByComponent(results, com, lc);
    }
    var am = com.appendMode;
    com.pageIndex = (s.page && s.page >= 1 ? s.page : 1);
    if (sr.total) {
      com.itemTotal = sr.total;
    }
    if (am) {
      var limit = s.limit;
      if (s.page <= 1 && s.firstLimit && s.firstLimit > 0) {
        limit = s.firstLimit;
      }
      com.nextPageToken = sr.nextPageToken;
      search_utilities_1.handleAppend(com, limit, sr.list, sr.nextPageToken);
      if (com.append && s.page > 1) {
        com.appendList(results);
      }
      else {
        com.setList(results);
      }
    }
    else {
      search_utilities_1.showPaging(com, s.limit, sr.list, sr.total);
      com.setList(results);
      com.tmpPageIndex = s.page;
      var m1 = search_utilities_1.buildSearchMessage(this.resourceService, s.page, s.limit, sr.list, sr.total);
      this.showMessage(m1);
    }
    com.running = false;
    if (this.loading) {
      this.loading.hideLoading();
    }
    if (com.triggerSearch) {
      com.triggerSearch = false;
      com.resetAndSearch();
    }
  };
  BaseSearchComponent.prototype.appendList = function (results) {
    var _a;
    var list = this.state.list;
    var arr = search_utilities_1.append(list, results);
    var listForm = this.getSearchForm();
    var props = this.props;
    var setGlobalState = props.props.setGlobalState;
    if (setGlobalState && listForm) {
      setGlobalState((_a = {}, _a[listForm.name] = arr, _a));
    }
    else {
      this.setState({ list: arr });
    }
  };
  BaseSearchComponent.prototype.setList = function (list) {
    var _a;
    var props = this.props;
    var setGlobalState = props.props.setGlobalState;
    this.list = list;
    var listForm = this.getSearchForm();
    if (setGlobalState && listForm) {
      setGlobalState((_a = {}, _a[listForm.name] = list, _a));
    }
    else {
      this.setState({ list: list });
    }
  };
  BaseSearchComponent.prototype.getList = function () {
    return this.list;
  };
  BaseSearchComponent.prototype.sort = function (event) {
    event.preventDefault();
    search_utilities_1.handleSortEvent(event, this);
    if (!this.appendMode) {
      this.doSearch();
    }
    else {
      this.resetAndSearch();
    }
  };
  BaseSearchComponent.prototype.showMore = function (event) {
    event.preventDefault();
    this.tmpPageIndex = this.pageIndex;
    search_utilities_1.more(this);
    this.doSearch();
  };
  BaseSearchComponent.prototype.pageChanged = function (data) {
    var currentPage = data.currentPage, itemsPerPage = data.itemsPerPage;
    search_utilities_1.changePage(this, currentPage, itemsPerPage);
    this.doSearch();
  };
  return BaseSearchComponent;
}(BaseComponent));
exports.BaseSearchComponent = BaseSearchComponent;
var SearchComponent = (function (_super) {
  __extends(SearchComponent, _super);
  function SearchComponent(props, sv, param, showMessage, showError, getLocale, uis, loading, listFormId) {
    var _this = _super.call(this, props, input_1.getResource(param), input_1.getMsgFunc(param, showMessage), input_1.getLocaleFunc(param, getLocale), input_1.getUIService(param, uis), input_1.getLoadingFunc(param, loading), listFormId) || this;
    _this.autoSearch = input_1.getAutoSearch(param);
    if (sv) {
      if (typeof sv === 'function') {
        var x = sv;
        _this.search = x;
      }
      else {
        _this.service = sv;
        if (_this.service.keys) {
          _this.keys = _this.service.keys();
        }
      }
    }
    _this.call = _this.call.bind(_this);
    _this.showError = input_1.getErrorFunc(param, showError);
    _this.componentDidMount = _this.componentDidMount.bind(_this);
    _this.mergeSearchModel = _this.mergeSearchModel.bind(_this);
    _this.createSearchModel = _this.createSearchModel.bind(_this);
    _this.ref = React.createRef();
    return _this;
  }
  SearchComponent.prototype.componentDidMount = function () {
    var k = (this.ui ? this.ui.registerEvents : null);
    this.form = core_1.initForm(this.ref.current, k);
    var s = this.mergeSearchModel(route_1.buildFromUrl(), this.createSearchModel());
    this.load(s, this.autoSearch);
  };
  SearchComponent.prototype.mergeSearchModel = function (obj, b, arrs) {
    return search_utilities_1.mergeSearchModel(obj, b, this.pageSizes, arrs);
  };
  SearchComponent.prototype.createSearchModel = function () {
    var s = {};
    return s;
  };
  SearchComponent.prototype.call = function (se) {
    return __awaiter(this, void 0, void 0, function () {
      var s, page, offset, limit, next, fields, sr, sr, err_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 5, 6, 7]);
            this.running = true;
            s = reflectx_1.clone(se);
            page = this.pageIndex;
            if (!page || page < 1) {
              page = 1;
            }
            offset = void 0;
            if (se.firstLimit && se.firstLimit > 0) {
              offset = se.limit * (page - 2) + se.firstLimit;
            }
            else {
              offset = se.limit * (page - 1);
            }
            limit = (page <= 1 && se.firstLimit && se.firstLimit > 0 ? se.firstLimit : se.limit);
            next = (this.nextPageToken && this.nextPageToken.length > 0 ? this.nextPageToken : offset);
            fields = se.fields;
            delete se['page'];
            delete se['fields'];
            delete se['limit'];
            delete se['firstLimit'];
            if (this.loading) {
              this.loading.showLoading();
            }
            if (!this.search) return [3, 2];
            return [4, this.search(s, limit, next, fields)];
          case 1:
            sr = _a.sent();
            this.showResults(s, sr);
            return [3, 4];
          case 2: return [4, this.service.search(s, limit, next, fields)];
          case 3:
            sr = _a.sent();
            this.showResults(s, sr);
            _a.label = 4;
          case 4: return [3, 7];
          case 5:
            err_2 = _a.sent();
            this.pageIndex = this.tmpPageIndex;
            core_1.error(err_2, this.resourceService.value, this.showError);
            return [3, 7];
          case 6:
            this.running = false;
            if (this.loading) {
              this.loading.hideLoading();
            }
            return [7];
          case 7: return [2];
        }
      });
    });
  };
  return SearchComponent;
}(BaseSearchComponent));
exports.SearchComponent = SearchComponent;
var BaseEditComponent = (function (_super) {
  __extends(BaseEditComponent, _super);
  function BaseEditComponent(props, resourceService, showMessage, showError, confirm, getLocale, ui, loading, status, patchable, backOnSaveSuccess) {
    var _this = _super.call(this, props, getLocale, (ui ? ui.removeError : null)) || this;
    _this.resourceService = resourceService;
    _this.showMessage = showMessage;
    _this.showError = showError;
    _this.confirm = confirm;
    _this.ui = ui;
    _this.loading = loading;
    _this.status = status;
    _this.backOnSuccess = true;
    _this.patchable = true;
    _this.addable = true;
    _this.newOnClick = function (event) {
      if (event) {
        event.preventDefault();
      }
      if (!_this.form && event && event.target && event.target.form) {
        _this.form = event.target.form;
      }
      var obj = _this.createModel();
      _this.resetState(true, obj, null);
      var u = _this.ui;
      if (u) {
        var f_1 = _this.form;
        setTimeout(function () {
          u.removeFormError(f_1);
        }, 100);
      }
    };
    _this.saveOnClick = function (event) {
      event.preventDefault();
      event.persist();
      if (!_this.form && event && event.target) {
        _this.form = event.target.form;
      }
      _this.onSave(_this.backOnSuccess);
    };
    _this.resource = resourceService.resource();
    if (patchable === false) {
      _this.patchable = patchable;
    }
    if (backOnSaveSuccess === false) {
      _this.backOnSuccess = backOnSaveSuccess;
    }
    _this.insertSuccessMsg = resourceService.value('msg_save_success');
    _this.updateSuccessMsg = resourceService.value('msg_save_success');
    _this.showMessage = _this.showMessage.bind(_this);
    _this.showError = _this.showError.bind(_this);
    _this.confirm = _this.confirm.bind(_this);
    _this.back = _this.back.bind(_this);
    _this.getModelName = _this.getModelName.bind(_this);
    _this.resetState = _this.resetState.bind(_this);
    _this.handleNotFound = _this.handleNotFound.bind(_this);
    _this.showModel = _this.showModel.bind(_this);
    _this.getModel = _this.getModel.bind(_this);
    _this.createModel = _this.createModel.bind(_this);
    _this.newOnClick = _this.newOnClick.bind(_this);
    _this.saveOnClick = _this.saveOnClick.bind(_this);
    _this.onSave = _this.onSave.bind(_this);
    _this.validate = _this.validate.bind(_this);
    _this.save = _this.save.bind(_this);
    _this.succeed = _this.succeed.bind(_this);
    _this.fail = _this.fail.bind(_this);
    _this.postSave = _this.postSave.bind(_this);
    _this.handleDuplicateKey = _this.handleDuplicateKey.bind(_this);
    return _this;
  }
  BaseEditComponent.prototype.back = function (event) {
    if (event) {
      event.preventDefault();
    }
    this.props.history.goBack();
  };
  BaseEditComponent.prototype.resetState = function (newMod, model, originalModel) {
    this.newMode = newMod;
    this.orginalModel = originalModel;
    this.showModel(model);
  };
  BaseEditComponent.prototype.handleNotFound = function (form) {
    var msg = core_1.message(this.resourceService.value, 'error_not_found', 'error');
    if (form) {
      formutil_1.readOnly(form);
    }
    this.showError(msg.message, msg.title);
  };
  BaseEditComponent.prototype.getModelName = function (f) {
    if (this.name && this.name.length > 0) {
      return this.name;
    }
    return _super.prototype.getModelName.call(this, f);
  };
  BaseEditComponent.prototype.getModel = function () {
    var n = this.getModelName();
    return this.props[n] || this.state[n];
  };
  BaseEditComponent.prototype.showModel = function (model) {
    var _this = this;
    var f = this.form;
    var modelName = this.getModelName();
    var objSet = {};
    objSet[modelName] = model;
    this.setState(objSet, function () {
      if (_this.readOnly) {
        formutil_1.readOnly(f);
      }
    });
  };
  BaseEditComponent.prototype.createModel = function () {
    if (this.metadata) {
      var obj = edit_1.createModel(this.metadata);
      return obj;
    }
    else {
      var obj = {};
      return obj;
    }
  };
  BaseEditComponent.prototype.onSave = function (isBack) {
    var _this = this;
    var r = this.resourceService;
    if (this.newMode && !this.addable) {
      var m = core_1.message(r.value, 'error_permission_add', 'error_permission');
      this.showError(m.message, m.title);
      return;
    }
    else if (!this.newMode && this.readOnly) {
      var msg = core_1.message(r.value, 'error_permission_edit', 'error_permission');
      this.showError(msg.message, msg.title);
      return;
    }
    else {
      if (this.running) {
        return;
      }
      var com_1 = this;
      var obj_1 = com_1.getModel();
      if (this.newMode) {
        com_1.validate(obj_1, function () {
          var msg = core_1.message(r.value, 'msg_confirm_save', 'confirm', 'yes', 'no');
          _this.confirm(msg.message, msg.title, function () {
            com_1.save(obj_1, obj_1, isBack);
          }, msg.no, msg.yes);
        });
      }
      else {
        var diffObj_1 = reflectx_1.makeDiff(edit_1.initPropertyNullInModel(this.orginalModel, this.metadata), obj_1, this.keys, this.version);
        var keys = Object.keys(diffObj_1);
        if (keys.length === 0) {
          this.showMessage(r.value('msg_no_change'));
        }
        else {
          com_1.validate(obj_1, function () {
            var msg = core_1.message(r.value, 'msg_confirm_save', 'confirm', 'yes', 'no');
            _this.confirm(msg.message, msg.title, function () {
              com_1.save(obj_1, diffObj_1, isBack);
            }, msg.no, msg.yes);
          });
        }
      }
    }
  };
  BaseEditComponent.prototype.validate = function (obj, callback) {
    if (this.ui) {
      var valid = this.ui.validateForm(this.form, this.getLocale());
      if (valid) {
        callback(obj);
      }
    }
    else {
      callback(obj);
    }
  };
  BaseEditComponent.prototype.save = function (obj, diff, isBack) {
  };
  BaseEditComponent.prototype.succeed = function (msg, isBack, result) {
    if (result) {
      var model = result.value;
      this.newMode = false;
      if (model && this.setBack) {
        this.resetState(false, model, reflectx_1.clone(model));
      }
      else {
        edit_1.handleVersion(this.getModel(), this.version);
      }
    }
    else {
      edit_1.handleVersion(this.getModel(), this.version);
    }
    var isBackO = (isBack == null || isBack === undefined ? this.backOnSuccess : isBack);
    this.showMessage(msg);
    if (isBackO) {
      this.back(null);
    }
  };
  BaseEditComponent.prototype.fail = function (result) {
    var errors = result.errors;
    var f = this.form;
    var u = this.ui;
    if (u) {
      var unmappedErrors = u.showFormError(f, errors);
      if (!result.message) {
        if (errors && errors.length === 1) {
          result.message = errors[0].message;
        }
        else {
          result.message = u.buildErrorMessage(unmappedErrors);
        }
      }
      formutil_1.focusFirstError(f);
    }
    else if (errors && errors.length === 1) {
      result.message = errors[0].message;
    }
    var t = this.resourceService.value('error');
    this.showError(result.message, t);
  };
  BaseEditComponent.prototype.postSave = function (res, backOnSave) {
    this.running = false;
    if (this.loading) {
      this.loading.hideLoading();
    }
    var st = this.status;
    var newMod = this.newMode;
    var successMsg = (newMod ? this.insertSuccessMsg : this.updateSuccessMsg);
    var x = res;
    var r = this.resourceService;
    if (!isNaN(x)) {
      if (x === st.Success) {
        this.succeed(successMsg, backOnSave);
      }
      else {
        if (newMod && x === st.DuplicateKey) {
          this.handleDuplicateKey();
        }
        else if (!newMod && x === st.NotFound) {
          this.handleNotFound();
        }
        else {
          edit_1.handleStatus(x, st, r.value, this.showError);
        }
      }
    }
    else {
      var result = x;
      if (result.status === st.Success) {
        this.succeed(successMsg, backOnSave, result);
        this.showMessage(successMsg);
      }
      else if (result.errors && result.errors.length > 0) {
        this.fail(result);
      }
      else if (newMod && result.status === st.DuplicateKey) {
        this.handleDuplicateKey(result);
      }
      else if (!newMod && x === st.NotFound) {
        this.handleNotFound();
      }
      else {
        edit_1.handleStatus(result.status, st, r.value, this.showError);
      }
    }
  };
  BaseEditComponent.prototype.handleDuplicateKey = function (result) {
    var msg = core_1.message(this.resourceService.value, 'error_duplicate_key', 'error');
    this.showError(msg.message, msg.title);
  };
  return BaseEditComponent;
}(BaseComponent));
exports.BaseEditComponent = BaseEditComponent;
var EditComponent = (function (_super) {
  __extends(EditComponent, _super);
  function EditComponent(props, service, param, showMessage, showError, confirm, getLocale, uis, loading, status, patchable, backOnSaveSuccess) {
    var _this = _super.call(this, props, input_1.getResource(param), input_1.getMsgFunc(param, showMessage), input_1.getErrorFunc(param, showError), input_1.getConfirmFunc(param, confirm), input_1.getLocaleFunc(param, getLocale), input_1.getUIService(param, uis), input_1.getLoadingFunc(param, loading), input_1.getEditStatusFunc(param, status), patchable, backOnSaveSuccess) || this;
    _this.service = service;
    if (service.metadata) {
      var metadata = service.metadata();
      if (metadata) {
        var meta = edit_1.build(metadata);
        _this.keys = meta.keys;
        _this.version = meta.version;
        _this.metadata = metadata;
      }
    }
    if (!_this.keys && service.keys) {
      var k = service.keys();
      if (k) {
        _this.keys = k;
      }
    }
    if (!_this.keys) {
      _this.keys = [];
    }
    _this.load = _this.load.bind(_this);
    _this.save = _this.save.bind(_this);
    _this.componentDidMount = _this.componentDidMount.bind(_this);
    _this.ref = React.createRef();
    return _this;
  }
  EditComponent.prototype.componentDidMount = function () {
    var k = (this.ui ? this.ui.registerEvents : null);
    this.form = core_1.initForm(this.ref.current, k);
    var id = core_1.buildId(this.props, this.keys);
    this.load(id);
  };
  EditComponent.prototype.load = function (_id, callback) {
    return __awaiter(this, void 0, void 0, function () {
      var id, ctx, obj, err_3, data, r, gv, title, msg, obj;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            id = _id;
            if (!(id != null && id !== '')) return [3, 6];
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, 4, 5]);
            this.running = true;
            if (this.loading) {
              this.loading.showLoading();
            }
            ctx = {};
            return [4, this.service.load(id, ctx)];
          case 2:
            obj = _a.sent();
            if (!obj) {
              this.handleNotFound(this.form);
            }
            else {
              this.newMode = false;
              this.orginalModel = reflectx_1.clone(obj);
              if (!callback) {
                this.showModel(obj);
              }
              else {
                callback(obj, this.showModel);
              }
            }
            return [3, 5];
          case 3:
            err_3 = _a.sent();
            data = (err_3 && err_3.response) ? err_3.response : err_3;
            r = this.resourceService;
            gv = r.value;
            title = gv('error');
            msg = gv('error_internal');
            if (data && data.status === 404) {
              this.handleNotFound(this.form);
            }
            else {
              if (data.status && !isNaN(data.status)) {
                msg = core_1.messageByHttpStatus(data.status, gv);
              }
              if (data && (data.status === 401 || data.status === 403)) {
                formutil_1.readOnly(this.form);
              }
              this.showError(msg, title);
            }
            return [3, 5];
          case 4:
            this.running = false;
            if (this.loading) {
              this.loading.hideLoading();
            }
            return [7];
          case 5: return [3, 7];
          case 6:
            this.newMode = true;
            this.orginalModel = null;
            obj = this.createModel();
            if (callback) {
              callback(obj, this.showModel);
            }
            else {
              this.showModel(obj);
            }
            _a.label = 7;
          case 7: return [2];
        }
      });
    });
  };
  EditComponent.prototype.save = function (obj, body, isBack) {
    return __awaiter(this, void 0, void 0, function () {
      var isBackO, com, ctx, result, result, result, err_4;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            this.running = true;
            if (this.loading) {
              this.loading.showLoading();
            }
            isBackO = (isBack == null || isBack === undefined ? this.backOnSuccess : isBack);
            com = this;
            _a.label = 1;
          case 1:
            _a.trys.push([1, 9, 10, 11]);
            ctx = {};
            if (!!this.newMode) return [3, 6];
            if (!(this.patchable === true && this.service.patch && body && Object.keys(body).length > 0)) return [3, 3];
            return [4, this.service.patch(body, ctx)];
          case 2:
            result = _a.sent();
            com.postSave(result, isBackO);
            return [3, 5];
          case 3: return [4, this.service.update(obj, ctx)];
          case 4:
            result = _a.sent();
            com.postSave(result, isBackO);
            _a.label = 5;
          case 5: return [3, 8];
          case 6: return [4, this.service.insert(obj, ctx)];
          case 7:
            result = _a.sent();
            com.postSave(result, isBackO);
            _a.label = 8;
          case 8: return [3, 11];
          case 9:
            err_4 = _a.sent();
            core_1.error(err_4, this.resourceService.value, this.showError);
            return [3, 11];
          case 10:
            this.running = false;
            if (this.loading) {
              this.loading.hideLoading();
            }
            return [7];
          case 11: return [2];
        }
      });
    });
  };
  return EditComponent;
}(BaseEditComponent));
exports.EditComponent = EditComponent;
