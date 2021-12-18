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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var reflectx_1 = require("reflectx");
var search_core_1 = require("search-core");
var core_1 = require("./core");
var core_2 = require("./core");
var diff_1 = require("./diff");
var edit_1 = require("./edit");
var formutil_1 = require("./formutil");
var input_1 = require("./input");
var route_1 = require("./route");
var state_1 = require("./state");
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
        _this.loadData = sv.load;
        if (sv.metadata) {
          var m = sv.metadata();
          if (m) {
            _this.metadata = m;
            var meta = edit_1.build(m);
            if (meta) {
              _this.keys = meta.keys;
            }
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
    var n = core_2.getModelName(this.form);
    if (!n || n.length === 0) {
      return 'model';
    }
    else {
      return n;
    }
  };
  ViewComponent.prototype.componentDidMount = function () {
    this.form = this.ref.current;
    var id = core_2.buildId(this.props, this.keys);
    if (id) {
      this.load(id);
    }
  };
  ViewComponent.prototype.load = function (_id, callback) {
    var id = _id;
    if (id != null && id !== '' && this.loadData) {
      this.running = true;
      core_1.showLoading(this.loading);
      var com_1 = this;
      this.loadData(id).then(function (obj) {
        if (!obj) {
          com_1.handleNotFound(com_1.form);
        }
        else {
          if (callback) {
            callback(obj, com_1.showModel);
          }
          else {
            com_1.showModel(obj);
          }
        }
        com_1.running = false;
        core_1.hideLoading(com_1.loading);
      }).catch(function (err) {
        var data = (err && err.response) ? err.response : err;
        if (data && data.status === 404) {
          com_1.handleNotFound(com_1.form);
        }
        else {
          core_2.error(err, com_1.resourceService.value, com_1.showError);
        }
        com_1.running = false;
        core_1.hideLoading(com_1.loading);
      });
    }
  };
  ViewComponent.prototype.handleNotFound = function (form) {
    var msg = core_2.message(this.resourceService.value, 'error_not_found', 'error');
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
      var value = core_2.removePhoneFormat(target.value);
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
      var a = core_2.getModelName(f2);
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
var MessageComponent = (function (_super) {
  __extends(MessageComponent, _super);
  function MessageComponent(props, getLocale, removeErr) {
    var _this = _super.call(this, props, getLocale, removeErr) || this;
    _this.alertClass = '';
    _this.showMessage = function (msg) {
      _this.alertClass = 'alert alert-info';
      _this.setState({ message: msg });
    };
    _this.showError = function (msg) {
      _this.alertClass = 'alert alert-error';
      if (typeof msg === 'string') {
        _this.setState({ message: msg });
      }
      else if (Array.isArray(msg) && msg.length > 0) {
        _this.setState({ message: msg[0].message });
      }
      else {
        var x = JSON.stringify(msg);
        _this.setState({ message: x });
      }
    };
    _this.hideMessage = function () {
      _this.alertClass = '';
      _this.setState({ message: '' });
    };
    _this.getModelName = _this.getModelName.bind(_this);
    _this.showMessage = _this.showMessage.bind(_this);
    _this.showError = _this.showError.bind(_this);
    _this.hideMessage = _this.hideMessage.bind(_this);
    _this.ref = React.createRef();
    return _this;
  }
  MessageComponent.prototype.getModelName = function (f) {
    if (this.name && this.name.length > 0) {
      return this.name;
    }
    var f2 = f;
    if (!f2) {
      f2 = this.form;
    }
    if (f2) {
      var a = core_2.getModelName(f2);
      if (a && a.length > 0) {
        return a;
      }
    }
    return 'model';
  };
  return MessageComponent;
}(BaseComponent));
exports.MessageComponent = MessageComponent;
var BaseSearchComponent = (function (_super) {
  __extends(BaseSearchComponent, _super);
  function BaseSearchComponent(props, resourceService, showMessage, getLocale, ui, loading, listFormId) {
    var _this = _super.call(this, props, getLocale, (ui ? ui.removeError : undefined)) || this;
    _this.resourceService = resourceService;
    _this.showMessage = showMessage;
    _this.ui = ui;
    _this.loading = loading;
    _this.listFormId = listFormId;
    _this.initPageSize = 24;
    _this.pageSize = 24;
    _this.pageIndex = 1;
    _this.total = 0;
    _this.pages = 0;
    _this.sequenceNo = 'sequenceNo';
    _this.tmpPageIndex = 1;
    _this.pageMaxSize = 7;
    _this.pageSizes = core_2.pageSizes;
    _this.viewable = true;
    _this.addable = true;
    _this.editable = true;
    _this.pageSizeOnClick = function () {
      _this.setState(function (prevState) { return ({ isPageSizeOpenDropDown: !prevState.isPageSizeOpenDropDown }); });
    };
    _this.pageSizeChanged = function (event) {
      var size = parseInt(event.currentTarget.value, 10);
      search_core_1.changePageSize(_this, size);
      _this.tmpPageIndex = 1;
      _this.doSearch();
    };
    _this.resource = resourceService.resource();
    _this.getModelName = _this.getModelName.bind(_this);
    _this.showMessage = _this.showMessage.bind(_this);
    _this.toggleFilter = _this.toggleFilter.bind(_this);
    _this.load = _this.load.bind(_this);
    _this.getSearchForm = _this.getSearchForm.bind(_this);
    _this.setSearchForm = _this.setSearchForm.bind(_this);
    _this.setFilter = _this.setFilter.bind(_this);
    _this.getFilter = _this.getFilter.bind(_this);
    _this.getFields = _this.getFields.bind(_this);
    _this.pageSizeChanged = _this.pageSizeChanged.bind(_this);
    _this.clearQ = _this.clearQ.bind(_this);
    _this.search = _this.search.bind(_this);
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
    var currentUrl = window.location.host + window.location.pathname;
    _this.url = removeUrlParams(currentUrl);
    return _this;
  }
  BaseSearchComponent.prototype.getModelName = function () {
    return 'filter';
  };
  BaseSearchComponent.prototype.toggleFilter = function (event) {
    this.hideFilter = !this.hideFilter;
  };
  BaseSearchComponent.prototype.load = function (s, autoSearch) {
    var obj2 = search_core_1.initFilter(s, this);
    this.setFilter(obj2);
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
  BaseSearchComponent.prototype.setFilter = function (filter) {
    var modelName = this.getModelName();
    var objSet = {};
    objSet[modelName] = filter;
    this.setState(objSet);
  };
  BaseSearchComponent.prototype.getCurrencyCode = function () {
    return core_2.getCurrencyCode(this.form);
  };
  BaseSearchComponent.prototype.getFilter = function () {
    var name = this.getModelName();
    var lc;
    if (this.getLocale) {
      lc = this.getLocale();
    }
    if (!lc) {
      lc = state_1.enLocale;
    }
    var cc = this.getCurrencyCode();
    var fields = this.getFields();
    var l = this.getList();
    var f = this.getSearchForm();
    var dc = (this.ui ? this.ui.decodeFromForm : undefined);
    var obj3 = search_core_1.getModel(this.state, name, this, fields, this.excluding, this.keys, l, f, dc, lc, cc);
    return obj3;
  };
  BaseSearchComponent.prototype.getFields = function () {
    var fs = search_core_1.getFieldsFromForm(this.fields, this.initFields, this.form);
    this.initFields = true;
    return fs;
  };
  BaseSearchComponent.prototype.clearQ = function () {
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
  BaseSearchComponent.prototype.search = function (event) {
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
    search_core_1.reset(this);
    this.tmpPageIndex = 1;
    this.doSearch();
  };
  BaseSearchComponent.prototype.doSearch = function (isFirstLoad) {
    var _this = this;
    var listForm = this.getSearchForm();
    if (listForm && this.ui) {
      this.ui.removeFormError(listForm);
    }
    var s = this.getFilter();
    var com = this;
    this.validateSearch(s, function () {
      if (com.running === true) {
        return;
      }
      com.running = true;
      core_1.showLoading(_this.loading);
      if (!_this.ignoreUrlParam) {
        search_core_1.addParametersIntoUrl(s, isFirstLoad);
      }
      com.call(s);
    });
  };
  BaseSearchComponent.prototype.call = function (s) {
  };
  BaseSearchComponent.prototype.validateSearch = function (se, callback) {
    var u = this.ui;
    var vl = (u ? u.validateForm : undefined);
    search_core_1.validate(se, callback, this.getSearchForm(), state_1.localeOf(undefined, this.getLocale), vl);
  };
  BaseSearchComponent.prototype.showResults = function (s, sr) {
    var com = this;
    var results = sr.list;
    if (results && results.length > 0) {
      var lc = state_1.localeOf(undefined, this.getLocale);
      search_core_1.formatResults(results, com.pageIndex, com.pageSize, com.pageSize, com.sequenceNo, com.format, lc);
    }
    var am = com.appendMode;
    com.pageIndex = (s.page && s.page >= 1 ? s.page : 1);
    if (sr.total) {
      com.total = sr.total;
    }
    if (am) {
      var limit = s.limit;
      if ((!s.page || s.page <= 1) && s.firstLimit && s.firstLimit > 0) {
        limit = s.firstLimit;
      }
      com.nextPageToken = sr.nextPageToken;
      search_core_1.handleAppend(com, sr.list, limit, sr.nextPageToken);
      if (com.append && (s.page && s.page > 1)) {
        com.appendList(results);
      }
      else {
        com.setList(results);
      }
    }
    else {
      search_core_1.showPaging(com, sr.list, s.limit, sr.total);
      com.setList(results);
      com.tmpPageIndex = s.page;
      if (s.limit) {
        this.showMessage(search_core_1.buildMessage(this.resourceService, s.page, s.limit, sr.list, sr.total));
      }
    }
    com.running = undefined;
    core_1.hideLoading(com.loading);
    if (com.triggerSearch) {
      com.triggerSearch = undefined;
      com.resetAndSearch();
    }
  };
  BaseSearchComponent.prototype.appendList = function (results) {
    var _a;
    var list = this.state.list;
    var arr = search_core_1.append(list, results);
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
    search_core_1.handleSortEvent(event, this);
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
    search_core_1.more(this);
    this.doSearch();
  };
  BaseSearchComponent.prototype.pageChanged = function (data) {
    var page = data.page, size = data.size;
    search_core_1.changePage(this, page, size);
    this.doSearch();
  };
  return BaseSearchComponent;
}(BaseComponent));
exports.BaseSearchComponent = BaseSearchComponent;
var SearchComponent = (function (_super) {
  __extends(SearchComponent, _super);
  function SearchComponent(props, sv, param, showMessage, showError, getLocale, uis, loading, listFormId) {
    var _this = _super.call(this, props, input_1.getResource(param), input_1.getMsgFunc(param, showMessage), input_1.getLocaleFunc(param, getLocale), input_1.getUIService(param, uis), input_1.getLoadingFunc(param, loading), listFormId) || this;
    _this.add = function (event) {
      event.preventDefault();
      var url = _this.url + '/add';
      _this.props.history.push(url);
    };
    _this.autoSearch = input_1.getAutoSearch(param);
    if (sv) {
      if (typeof sv === 'function') {
        var x = sv;
        _this.service = x;
      }
      else {
        _this.service = sv.search;
        if (sv.keys) {
          _this.keys = sv.keys();
        }
      }
    }
    _this.add = _this.add.bind(_this);
    _this.call = _this.call.bind(_this);
    _this.showError = input_1.getErrorFunc(param, showError);
    _this.componentDidMount = _this.componentDidMount.bind(_this);
    _this.mergeFilter = _this.mergeFilter.bind(_this);
    _this.createFilter = _this.createFilter.bind(_this);
    _this.ref = React.createRef();
    return _this;
  }
  SearchComponent.prototype.componentDidMount = function () {
    var k = (this.ui ? this.ui.registerEvents : undefined);
    this.form = core_2.initForm(this.ref.current, k);
    var s = this.mergeFilter(route_1.buildFromUrl(), this.createFilter());
    this.load(s, this.autoSearch);
  };
  SearchComponent.prototype.mergeFilter = function (obj, b, arrs) {
    return search_core_1.mergeFilter(obj, b, this.pageSizes, arrs);
  };
  SearchComponent.prototype.createFilter = function () {
    var s = {};
    return s;
  };
  SearchComponent.prototype.call = function (se) {
    this.running = true;
    var s = reflectx_1.clone(se);
    var page = this.pageIndex;
    if (!page || page < 1) {
      page = 1;
    }
    var offset;
    if (se.limit) {
      if (se.firstLimit && se.firstLimit > 0) {
        offset = se.limit * (page - 2) + se.firstLimit;
      }
      else {
        offset = se.limit * (page - 1);
      }
    }
    var limit = (page <= 1 && se.firstLimit && se.firstLimit > 0 ? se.firstLimit : se.limit);
    var next = (this.nextPageToken && this.nextPageToken.length > 0 ? this.nextPageToken : offset);
    var fields = se.fields;
    delete se['page'];
    delete se['fields'];
    delete se['limit'];
    delete se['firstLimit'];
    core_1.showLoading(this.loading);
    var com = this;
    if (this.service) {
      this.service(s, limit, next, fields).then(function (sr) {
        com.showResults(s, sr);
        com.running = undefined;
        core_1.hideLoading(com.loading);
      }).catch(function (err) {
        com.pageIndex = com.tmpPageIndex;
        core_2.error(err, com.resourceService.value, com.showError);
        com.running = undefined;
        core_1.hideLoading(com.loading);
      });
    }
  };
  return SearchComponent;
}(BaseSearchComponent));
exports.SearchComponent = SearchComponent;
var BaseEditComponent = (function (_super) {
  __extends(BaseEditComponent, _super);
  function BaseEditComponent(props, resourceService, showMessage, showError, confirm, getLocale, ui, loading, status, patchable, backOnSaveSuccess) {
    var _this = _super.call(this, props, getLocale, (ui ? ui.removeError : undefined)) || this;
    _this.resourceService = resourceService;
    _this.showMessage = showMessage;
    _this.showError = showError;
    _this.confirm = confirm;
    _this.ui = ui;
    _this.loading = loading;
    _this.backOnSuccess = true;
    _this.patchable = true;
    _this.addable = true;
    _this.create = function (event) {
      if (event) {
        event.preventDefault();
      }
      if (!_this.form && event && event.target && event.target.form) {
        _this.form = event.target.form;
      }
      var obj = _this.createModel();
      _this.resetState(true, obj, undefined);
      var u = _this.ui;
      var f = _this.form;
      if (u && f) {
        setTimeout(function () {
          u.removeFormError(f);
        }, 100);
      }
    };
    _this.save = function (event) {
      event.preventDefault();
      event.persist();
      if (!_this.form && event && event.target) {
        _this.form = event.target.form;
      }
      _this.onSave(_this.backOnSuccess);
    };
    _this.resource = resourceService.resource();
    _this.status = core_1.createEditStatus(status);
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
    _this.create = _this.create.bind(_this);
    _this.save = _this.save.bind(_this);
    _this.onSave = _this.onSave.bind(_this);
    _this.validate = _this.validate.bind(_this);
    _this.doSave = _this.doSave.bind(_this);
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
    var msg = core_2.message(this.resourceService.value, 'error_not_found', 'error');
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
      var m = core_2.message(r.value, 'error_permission_add', 'error_permission');
      this.showError(m.message, m.title);
      return;
    }
    else if (!this.newMode && this.readOnly) {
      var msg = core_2.message(r.value, 'error_permission_edit', 'error_permission');
      this.showError(msg.message, msg.title);
      return;
    }
    else {
      if (this.running) {
        return;
      }
      var com_2 = this;
      var obj_1 = com_2.getModel();
      if (this.newMode) {
        com_2.validate(obj_1, function () {
          var msg = core_2.message(r.value, 'msg_confirm_save', 'confirm', 'yes', 'no');
          _this.confirm(msg.message, msg.title, function () {
            com_2.doSave(obj_1, obj_1, isBack);
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
          com_2.validate(obj_1, function () {
            var msg = core_2.message(r.value, 'msg_confirm_save', 'confirm', 'yes', 'no');
            _this.confirm(msg.message, msg.title, function () {
              com_2.doSave(obj_1, diffObj_1, isBack);
            }, msg.no, msg.yes);
          });
        }
      }
    }
  };
  BaseEditComponent.prototype.validate = function (obj, callback) {
    if (this.ui && this.form) {
      var valid = this.ui.validateForm(this.form, state_1.localeOf(undefined, this.getLocale));
      if (valid) {
        callback(obj);
      }
    }
    else {
      callback(obj);
    }
  };
  BaseEditComponent.prototype.doSave = function (obj, dif, isBack) {
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
    if (u && f) {
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
    if (result.message) {
      var t = this.resourceService.value('error');
      this.showError(result.message, t);
    }
  };
  BaseEditComponent.prototype.postSave = function (res, backOnSave) {
    this.running = false;
    core_1.hideLoading(this.loading);
    var st = this.status;
    var newMod = this.newMode;
    var successMsg = (newMod ? this.insertSuccessMsg : this.updateSuccessMsg);
    var x = res;
    var r = this.resourceService;
    if (!isNaN(x)) {
      if (x === st.success) {
        this.succeed(successMsg, backOnSave);
      }
      else {
        if (newMod && x === st.duplicate_key) {
          this.handleDuplicateKey();
        }
        else if (!newMod && x === st.not_found) {
          this.handleNotFound();
        }
        else {
          edit_1.handleStatus(x, st, r.value, this.showError);
        }
      }
    }
    else {
      var result = x;
      if (result.status === st.success) {
        this.succeed(successMsg, backOnSave, result);
        this.showMessage(successMsg);
      }
      else if (result.errors && result.errors.length > 0) {
        this.fail(result);
      }
      else if (newMod && result.status === st.duplicate_key) {
        this.handleDuplicateKey(result);
      }
      else if (!newMod && x === st.not_found) {
        this.handleNotFound();
      }
      else {
        edit_1.handleStatus(result.status, st, r.value, this.showError);
      }
    }
  };
  BaseEditComponent.prototype.handleDuplicateKey = function (result) {
    var msg = core_2.message(this.resourceService.value, 'error_duplicate_key', 'error');
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
        if (meta) {
          _this.keys = meta.keys;
          _this.version = meta.version;
        }
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
    _this.doSave = _this.doSave.bind(_this);
    _this.componentDidMount = _this.componentDidMount.bind(_this);
    _this.ref = React.createRef();
    return _this;
  }
  EditComponent.prototype.componentDidMount = function () {
    var k = (this.ui ? this.ui.registerEvents : undefined);
    this.form = core_2.initForm(this.ref.current, k);
    var id = core_2.buildId(this.props, this.keys);
    if (id) {
      this.load(id);
    }
  };
  EditComponent.prototype.load = function (_id, callback) {
    var _this = this;
    var id = _id;
    if (id != null && id !== '') {
      var com_3 = this;
      this.running = true;
      core_1.showLoading(com_3.loading);
      this.service.load(id).then(function (obj) {
        if (!obj) {
          com_3.handleNotFound(_this.form);
        }
        else {
          com_3.newMode = false;
          com_3.orginalModel = reflectx_1.clone(obj);
          if (!callback) {
            com_3.showModel(obj);
          }
          else {
            callback(obj, com_3.showModel);
          }
        }
        com_3.running = false;
        core_1.hideLoading(com_3.loading);
      }).catch(function (err) {
        var data = (err && err.response) ? err.response : err;
        var r = com_3.resourceService;
        var gv = r.value;
        var title = gv('error');
        var msg = gv('error_internal');
        if (data && data.status === 404) {
          com_3.handleNotFound(com_3.form);
        }
        else {
          if (data.status && !isNaN(data.status)) {
            msg = core_2.messageByHttpStatus(data.status, gv);
          }
          if (data && (data.status === 401 || data.status === 403)) {
            formutil_1.readOnly(com_3.form);
          }
          com_3.showError(msg, title);
        }
        com_3.running = false;
        core_1.hideLoading(com_3.loading);
      });
    }
    else {
      this.newMode = true;
      this.orginalModel = undefined;
      var obj = this.createModel();
      if (callback) {
        callback(obj, this.showModel);
      }
      else {
        this.showModel(obj);
      }
    }
  };
  EditComponent.prototype.doSave = function (obj, body, isBack) {
    this.running = true;
    core_1.showLoading(this.loading);
    var isBackO = (isBack == null || isBack === undefined ? this.backOnSuccess : isBack);
    var com = this;
    var m = obj;
    var fn = this.newMode ? this.service.insert : this.service.update;
    if (!this.newMode) {
      if (this.patchable === true && this.service.patch && body && Object.keys(body).length > 0) {
        m = body;
        fn = this.service.patch;
      }
    }
    fn(m).then(function (result) {
      com.postSave(result, isBackO);
      com.running = false;
      core_1.hideLoading(com.loading);
    }).then(function (err) {
      core_2.error(err, com.resourceService.value, com.showError);
      com.running = false;
      core_1.hideLoading(com.loading);
    });
  };
  return EditComponent;
}(BaseEditComponent));
exports.EditComponent = EditComponent;
var BaseDiffApprComponent = (function (_super) {
  __extends(BaseDiffApprComponent, _super);
  function BaseDiffApprComponent(props, keys, resourceService, showMessage, showError, loading, status) {
    var _this = _super.call(this, props) || this;
    _this.keys = keys;
    _this.resourceService = resourceService;
    _this.showMessage = showMessage;
    _this.showError = showError;
    _this.loading = loading;
    _this.resource = resourceService.resource();
    _this.showMessage = _this.showMessage.bind(_this);
    _this.showError = _this.showError.bind(_this);
    _this.back = _this.back.bind(_this);
    _this.initModel = _this.initModel.bind(_this);
    _this.postApprove = _this.postApprove.bind(_this);
    _this.postReject = _this.postReject.bind(_this);
    _this.format = _this.format.bind(_this);
    _this.handleNotFound = _this.handleNotFound.bind(_this);
    _this.status = core_1.createDiffStatus(status);
    _this.state = {
      disabled: false
    };
    return _this;
  }
  BaseDiffApprComponent.prototype.back = function (event) {
    if (event) {
      event.preventDefault();
    }
    this.props.history.goBack();
  };
  BaseDiffApprComponent.prototype.initModel = function () {
    var x = {};
    return x;
  };
  BaseDiffApprComponent.prototype.postApprove = function (s, err) {
    this.setState({ disabled: true });
    var r = this.resourceService;
    var st = this.status;
    if (s === st.success) {
      this.showMessage(r.value('msg_approve_success'));
    }
    else if (s === st.version_error) {
      var msg = core_2.message(r.value, 'msg_approve_version_error', 'error');
      this.showError(msg.message, msg.title);
    }
    else if (s === st.not_found) {
      this.handleNotFound();
    }
    else {
      core_2.error(err, r.value, this.showError);
    }
  };
  BaseDiffApprComponent.prototype.postReject = function (status, err) {
    this.setState({ disabled: true });
    var r = this.resourceService;
    var st = this.status;
    if (status === st.success) {
      this.showMessage(r.value('msg_reject_success'));
    }
    else if (status === st.version_error) {
      var msg = core_2.message(r.value, 'msg_approve_version_error', 'error');
      this.showError(msg.message, msg.title);
    }
    else if (status === st.not_found) {
      this.handleNotFound();
    }
    else {
      core_2.error(err, r.value, this.showError);
    }
  };
  BaseDiffApprComponent.prototype.format = function () {
    var p = this.props;
    var diffModel = p['diffModel'];
    if (diffModel) {
      var differentKeys_1 = reflectx_1.diff(diffModel.origin, diffModel.value);
      var dataFields = diff_1.getDataFields(this.form);
      dataFields.forEach(function (e) {
        var x = e.getAttribute('data-field');
        if (x) {
          if (differentKeys_1.indexOf(x) >= 0) {
            if (e.childNodes.length === 3) {
              e.childNodes[1].classList.add('highlight');
              e.childNodes[2].classList.add('highlight');
            }
            else {
              e.classList.add('highlight');
            }
          }
        }
      });
    }
    else {
      var _a = this.state, origin_1 = _a.origin, value = _a.value;
      var differentKeys_2 = reflectx_1.diff(origin_1, value);
      var dataFields = diff_1.getDataFields(this.form);
      dataFields.forEach(function (e) {
        var x = e.getAttribute('data-field');
        if (x) {
          if (differentKeys_2.indexOf(x) >= 0) {
            if (e.childNodes.length === 3) {
              e.childNodes[1].classList.add('highlight');
              e.childNodes[2].classList.add('highlight');
            }
            else {
              e.classList.add('highlight');
            }
          }
        }
      });
    }
  };
  BaseDiffApprComponent.prototype.handleNotFound = function () {
    this.setState({ disabled: true });
    var msg = core_2.message(this.resourceService.value, 'error_not_found', 'error');
    this.showError(msg.message, msg.title);
  };
  return BaseDiffApprComponent;
}(React.Component));
exports.BaseDiffApprComponent = BaseDiffApprComponent;
var DiffApprComponent = (function (_super) {
  __extends(DiffApprComponent, _super);
  function DiffApprComponent(props, service, param, showMessage, showError, loading, status) {
    var _this = _super.call(this, props, service.keys(), input_1.getResource(param), input_1.getMsgFunc(param, showMessage), input_1.getErrorFunc(param, showError), input_1.getLoadingFunc(param, loading), input_1.getDiffStatusFunc(param, status)) || this;
    _this.service = service;
    _this.approve = _this.approve.bind(_this);
    _this.reject = _this.reject.bind(_this);
    _this.formatFields = _this.formatFields.bind(_this);
    _this.ref = React.createRef();
    _this.state = {
      origin: _this.initModel(),
      value: _this.initModel(),
      disabled: false,
    };
    return _this;
  }
  DiffApprComponent.prototype.componentDidMount = function () {
    this.form = this.ref.current;
    var id = core_2.buildId(this.props, this.keys);
    if (id) {
      this.load(id);
    }
  };
  DiffApprComponent.prototype.formatFields = function (value) {
    return value;
  };
  DiffApprComponent.prototype.load = function (_id) {
    var id = _id;
    if (id != null && id !== '') {
      this.id = _id;
      var com_4 = this;
      this.running = true;
      core_1.showLoading(this.loading);
      this.service.diff(id).then(function (dobj) {
        if (!dobj) {
          com_4.handleNotFound();
        }
        else {
          var formatdDiff = diff_1.formatDiffModel(dobj, com_4.formatFields);
          com_4.setState({
            origin: formatdDiff.origin,
            value: formatdDiff.value
          }, com_4.format);
        }
        com_4.running = false;
        core_1.hideLoading(com_4.loading);
      }).catch(function (err) {
        var data = (err && err.response) ? err.response : err;
        if (data && data.status === 404) {
          com_4.handleNotFound();
        }
        else {
          core_2.error(err, com_4.resourceService.value, com_4.showError);
        }
        com_4.running = false;
        core_1.hideLoading(com_4.loading);
      });
    }
  };
  DiffApprComponent.prototype.approve = function (event) {
    event.preventDefault();
    var com = this;
    this.running = true;
    core_1.showLoading(this.loading);
    if (this.id) {
      this.service.approve(this.id).then(function (status) {
        com.postApprove(status, null);
        com.running = false;
        core_1.hideLoading(com.loading);
      }).catch(function (err) {
        com.postApprove(4, err);
        com.running = false;
        core_1.hideLoading(com.loading);
      });
    }
  };
  DiffApprComponent.prototype.reject = function (event) {
    event.preventDefault();
    var com = this;
    this.running = true;
    core_1.showLoading(this.loading);
    if (this.id) {
      this.service.reject(this.id).then(function (status) {
        com.postReject(status, null);
        com.running = false;
        core_1.hideLoading(com.loading);
      }).catch(function (err) {
        com.postReject(4, err);
        com.running = false;
        core_1.hideLoading(com.loading);
      });
    }
  };
  return DiffApprComponent;
}(BaseDiffApprComponent));
exports.DiffApprComponent = DiffApprComponent;
function removeUrlParams(url) {
  var startParams = url.indexOf('?');
  return startParams !== -1 ? url.substring(0, startParams) : url;
}
exports.removeUrlParams = removeUrlParams;
