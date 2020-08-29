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
Object.defineProperty(exports,"__esModule",{value:true});
var form_util_1 = require("form-util");
var React = require("react");
var reflectx_1 = require("reflectx");
var reflectx_2 = require("reflectx");
var search_utilities_1 = require("search-utilities");
var ui_plus_1 = require("ui-plus");
var uione_1 = require("uione");
var uione_2 = require("uione");
var uione_3 = require("uione");
var uione_4 = require("uione");
var core_1 = require("./core");
var edit_1 = require("./edit");
var route_1 = require("./route");
var util_1 = require("./util");
var BaseViewComponent = (function (_super) {
  __extends(BaseViewComponent, _super);
  function BaseViewComponent(props) {
    var _this = _super.call(this, props) || this;
    _this._includingCurrencySymbol = false;
    _this.resource = uione_2.storage.getResource();
    _this.dateTimeFormat = null;
    _this.requireAuthentication = _this.requireAuthentication.bind(_this);
    _this.getLocale = _this.getLocale.bind(_this);
    _this.back = _this.back.bind(_this);
    _this.alertError = _this.alertError.bind(_this);
    _this.handleError = _this.handleError.bind(_this);
    return _this;
  }
  BaseViewComponent.prototype.includingCurrencySymbol = function () {
    return this._includingCurrencySymbol;
  };
  BaseViewComponent.prototype.getCurrencyCode = function () {
    return (this.form ? this.form.getAttribute('currency-code') : null);
  };
  BaseViewComponent.prototype.getLocale = function () {
    return uione_2.storage.getLocale();
  };
  BaseViewComponent.prototype.back = function (event) {
    if (event) {
      event.preventDefault();
    }
    this.props.history.goBack();
  };
  BaseViewComponent.prototype.handleError = function (err) {
    uione_2.storage.loading().hideLoading();
    this.running = false;
    var data = err.response ? err.response : err;
    var descriptions = [];
    var errCodeList = [];
    var callBack = null;
    var r = uione_2.storage.resource();
    var title = r.value('error');
    var msg = r.value('error_internal');
    if (data && data.status) {
      if (data.status === 404) {
        msg = r.value('error_not_found');
        errCodeList.push(data.statusText);
        descriptions.push(msg);
        var errCode = this.returnErrCodeIfExist(errCodeList, 'InvalidAuthorizationToken');
        callBack = this.makeCallBackHandleError(errCode);
        this.alertError(descriptions.join('<br>'), title, null, callBack);
      }
      else if (data.status === 401) {
        msg = r.value('error_unauthorized');
        errCodeList.push('InvalidAuthorizationToken');
        descriptions.push(msg);
        var errCode = this.returnErrCodeIfExist(errCodeList, 'InvalidAuthorizationToken');
        callBack = this.makeCallBackHandleError(errCode);
        this.alertError(descriptions.join('<br>'), title, null, callBack);
      }
      else if (data.status === 403) {
        msg = r.value('error_forbidden');
        errCodeList.push('Forbidden');
        descriptions.push(msg);
        var errCode = this.returnErrCodeIfExist(errCodeList, 'InvalidAuthorizationToken');
        callBack = this.makeCallBackHandleError(errCode);
        this.alertError(descriptions.join('<br>'), title, null, callBack);
      }
      else {
        msg = uione_1.messageByHttpStatus(data.status, r);
        this.alertError(msg, title, null, callBack);
      }
    }
    else {
      this.alertError(msg, title, null, callBack);
    }
  };
  BaseViewComponent.prototype.makeCallBackHandleError = function (errCode) {
    switch (errCode) {
      case 'InvalidAuthorizationToken': {
        return this.requireAuthentication();
      }
    }
  };
  BaseViewComponent.prototype.alertError = function (msg, title, detail, callback) {
    uione_2.storage.alert().alertError(msg, title, detail, callback);
  };
  BaseViewComponent.prototype.requireAuthentication = function () {
    sessionStorage.clear();
    var redirect = window.location.pathname;
    this.props.history.push('/auth?redirect=' + redirect);
  };
  BaseViewComponent.prototype.returnErrCodeIfExist = function (arrayErrCode, expected) {
    return arrayErrCode.find(function (errCode) { return errCode === expected; });
  };
  return BaseViewComponent;
}(React.Component));
exports.BaseViewComponent = BaseViewComponent;
var ViewComponent = (function (_super) {
  __extends(ViewComponent, _super);
  function ViewComponent(props, metadata, viewService) {
    var _this = _super.call(this, props) || this;
    _this.metadata = metadata;
    _this.viewService = viewService;
    _this.getModelName = _this.getModelName.bind(_this);
    _this.load = _this.load.bind(_this);
    _this.getModel = _this.getModel.bind(_this);
    _this.showModel = _this.showModel.bind(_this);
    return _this;
  }
  ViewComponent.prototype.getModelName = function () {
    return (this.metadata ? this.metadata.name : '');
  };
  ViewComponent.prototype.load = function (_id) {
    return __awaiter(this, void 0, void 0, function () {
      var id, obj, err_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            id = _id;
            if (!(id != null && id !== '')) return [3, 5];
            this.running = true;
            uione_2.storage.loading().showLoading();
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, 4, 5]);
            return [4, this.viewService.load(id)];
          case 2:
            obj = _a.sent();
            this.showModel(obj);
            return [3, 5];
          case 3:
            err_1 = _a.sent();
            if (err_1 && err_1.status === 404) {
              this.handleNotFound(this.form);
            }
            else {
              this.handleError(err_1);
            }
            return [3, 5];
          case 4:
            this.running = false;
            uione_2.storage.loading().hideLoading();
            return [7];
          case 5: return [2];
        }
      });
    });
  };
  ViewComponent.prototype.handleNotFound = function (form) {
    var msg = uione_3.message(uione_2.storage.resource(), 'error_not_found', 'error');
    if (this.form) {
      form_util_1.readOnly(this.form);
    }
    this.alertError(msg.message, msg.title);
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
}(BaseViewComponent));
exports.ViewComponent = ViewComponent;
var BaseComponent = (function (_super) {
  __extends(BaseComponent, _super);
  function BaseComponent(props) {
    var _this = _super.call(this, props) || this;
    _this.scrollToFocus = function (e, isUseTimeOut) {
      if (isUseTimeOut === void 0) { isUseTimeOut = false; }
      try {
        var element = e.target;
        var container_1 = e.target.form.childNodes[1];
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
    _this.updatePhoneState = function (event) {
      var re = /^[0-9\b]+$/;
      var value = ui_plus_1.formatter.removePhoneFormat(event.currentTarget.value);
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
        event.currentTarget.value = responseStr_1;
        _this.updateState(event);
      }
    };
    _this.updateDateState = function (name, value) {
      var _a, _b, _c, _d, _e;
      var props = _this.props;
      var modelName = _this.form.getAttribute('model-name');
      var state = _this.state[modelName];
      if (props.setGlobalState) {
        var data = props.shouldBeCustomized ? _this.prepareCustomData((_a = {}, _a[name] = value, _a)) : (_b = {}, _b[name] = value, _b);
        props.setGlobalState((_c = {}, _c[modelName] = __assign(__assign({}, state), data), _c));
      }
      else {
        _this.setState((_d = {}, _d[modelName] = __assign(__assign({}, state), (_e = {}, _e[name] = value, _e)), _d));
      }
    };
    _this.updateState = function (e, callback, locale) {
      var _a, _b, _c, _d;
      var props = _this.props;
      var ctrl = e.currentTarget;
      var updateStateMethod = props.setGlobalState;
      var modelName = ctrl.form.getAttribute('model-name');
      var propsDataForm = props[modelName];
      var type = ctrl.getAttribute('type');
      var isPreventDefault = type && (['checkbox', 'radio'].indexOf(type.toLowerCase()) >= 0 ? false : true);
      if (isPreventDefault) {
        e.preventDefault();
      }
      if (ctrl.nodeName === 'SELECT' &&
        ctrl.value &&
        ctrl.classList.contains('invalid')) {
        _this.uiS1.removeErrorMessage(ctrl);
      }
      if (updateStateMethod) {
        var form = ctrl.form;
        var formName = form.name;
        if (!locale) {
          locale = _this.getLocale();
        }
        var res = util_1.valueOf(ctrl, locale, e.type);
        if (res.mustChange) {
          var dataField = ctrl.getAttribute('data-field');
          var field = (dataField ? dataField : ctrl.name);
          if (field.indexOf('.') < 0 && field.indexOf('[') < 0) {
            var data = props.shouldBeCustomized ? _this.prepareCustomData((_a = {}, _a[ctrl.name] = res.value, _a)) : (_b = {}, _b[ctrl.name] = res.value, _b);
            props.setGlobalState((_c = {}, _c[formName] = __assign(__assign({}, propsDataForm), data), _c));
          }
          else {
            reflectx_1.setValue(propsDataForm, field, ctrl.value);
            props.setGlobalState((_d = {}, _d[formName] = __assign({}, propsDataForm), _d));
          }
        }
      }
      else {
        var form = ctrl.form;
        if (form) {
          if (modelName && modelName !== '') {
            var ex = _this.state[modelName];
            var dataField = ctrl.getAttribute('data-field');
            var field = (dataField ? dataField : ctrl.name);
            var model = Object.assign({}, ex);
            if (type && type.toLowerCase() === 'checkbox') {
              var ctrlOnValue = ctrl.getAttribute('data-on-value');
              var ctrlOffValue = ctrl.getAttribute('data-off-value');
              var onValue = ctrlOnValue ? ctrlOnValue : true;
              var offValue = ctrlOffValue ? ctrlOffValue : false;
              model[field] = ctrl.checked ? onValue : offValue;
              var objSet = {};
              objSet[modelName] = model;
              if (callback) {
                _this.setState(objSet, callback);
              }
              else {
                _this.setState(objSet);
              }
            }
            else if (type && type.toLowerCase() === 'radio') {
              if (field.indexOf('.') < 0 && field.indexOf('[') < 0) {
                model[field] = ctrl.value;
              }
              else {
                reflectx_1.setValue(model, field, ctrl.value);
              }
              var objSet = {};
              objSet[modelName] = model;
              if (callback) {
                _this.setState(objSet, callback);
              }
              else {
                _this.setState(objSet);
              }
            }
            else {
              var tloc = (!locale ? _this.getLocale() : locale);
              var data = util_1.valueOf(ctrl, tloc, e.type);
              if (data.mustChange) {
                if (field.indexOf('.') < 0 && field.indexOf('[') < 0) {
                  model[field] = data.value;
                }
                else {
                  reflectx_1.setValue(model, field, data.value);
                }
                var objSet = {};
                objSet[modelName] = model;
                if (callback) {
                  _this.setState(objSet, callback);
                }
                else {
                  _this.setState(objSet);
                }
              }
            }
          }
          else {
            _this.updateFlatState(e, callback);
          }
        }
        else {
          _this.updateFlatState(e, callback);
        }
      }
    };
    _this.uiS1 = uione_2.storage.ui();
    _this.updateState = _this.updateState.bind(_this);
    _this.updateFlatState = _this.updateFlatState.bind(_this);
    _this.updatePhoneState = _this.updatePhoneState.bind(_this);
    _this.updateDateState = _this.updateDateState.bind(_this);
    _this.prepareCustomData = _this.prepareCustomData.bind(_this);
    return _this;
  }
  BaseComponent.prototype.prepareCustomData = function (data) { };
  BaseComponent.prototype.updateFlatState = function (e, callback, locale) {
    var _a;
    var ctrl = e.currentTarget;
    var stateName = ctrl.name;
    var objSet = {};
    var type = ctrl.getAttribute('type');
    if (type && type.toLowerCase() === 'checkbox') {
      if (ctrl.id && stateName === ctrl.id) {
        var origin_1 = this.state[stateName];
        objSet[stateName] = (origin_1 ? !origin_1 : true);
        this.setState(objSet);
      }
      else {
        var value = this.state[stateName];
        value.includes(ctrl.value) ? value = value.filter(function (v) { return v !== ctrl.value; }) : value.push(ctrl.value);
        this.setState((_a = {}, _a[ctrl.name] = value, _a));
      }
    }
    else {
      var tloc = (!locale ? this.getLocale() : locale);
      var data = util_1.valueOf(ctrl, tloc, e.type);
      if (data.mustChange) {
        objSet[stateName] = data.value;
        if (callback) {
          this.setState(objSet, callback);
        }
        else {
          this.setState(objSet);
        }
      }
    }
  };
  return BaseComponent;
}(BaseViewComponent));
exports.BaseComponent = BaseComponent;
var BaseSearchComponent = (function (_super) {
  __extends(BaseSearchComponent, _super);
  function BaseSearchComponent(props, listFormId) {
    var _this = _super.call(this, props) || this;
    _this.listFormId = listFormId;
    _this.initPageSize = 20;
    _this.pageSize = 20;
    _this.pageIndex = 1;
    _this.showPaging = false;
    _this.append = false;
    _this.appendMode = false;
    _this.appendable = false;
    _this.initDisplayFields = false;
    _this.sequenceNo = 'sequenceNo';
    _this.triggerSearch = false;
    _this.pageMaxSize = 7;
    _this.pageSizes = [10, 20, 40, 60, 100, 200, 400, 800];
    _this.ignoreUrlParam = false;
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
    _this.clearKeyworkOnClick = function () {
      _this.setState({
        keyword: ''
      });
    };
    _this.pageSizeChanged = function (event) {
      var size = parseInt(event.currentTarget.value, null);
      search_utilities_1.changePageSize(_this, size);
      _this.tmpPageIndex = 1;
      _this.doSearch();
    };
    _this.ui = uione_2.storage.ui();
    _this.showMessage = _this.showMessage.bind(_this);
    _this.getSearchForm = _this.getSearchForm.bind(_this);
    _this.setSearchForm = _this.setSearchForm.bind(_this);
    _this.mergeSearchModel = _this.mergeSearchModel.bind(_this);
    _this.load = _this.load.bind(_this);
    _this.add = _this.add.bind(_this);
    _this.searchOnClick = _this.searchOnClick.bind(_this);
    _this.sort = _this.sort.bind(_this);
    _this.showMore = _this.showMore.bind(_this);
    _this.toggleFilter = _this.toggleFilter.bind(_this);
    _this.doSearch = _this.doSearch.bind(_this);
    _this.pageChanged = _this.pageChanged.bind(_this);
    _this.pageSizeChanged = _this.pageSizeChanged.bind(_this);
    _this.clearKeyworkOnClick = _this.clearKeyworkOnClick.bind(_this);
    _this.mergeUrlSearchModel = _this.mergeUrlSearchModel.bind(_this);
    _this.showResults = _this.showResults.bind(_this);
    _this.searchError = _this.searchError.bind(_this);
    _this.getDisplayFields = _this.getDisplayFields.bind(_this);
    _this.url = (props.match ? props.match.url : props['props'].match.url);
    return _this;
  }
  BaseSearchComponent.prototype.mergeUrlSearchModel = function (searchModel) {
    for (var _i = 0, _a = Object.keys(searchModel); _i < _a.length; _i++) {
      var key = _a[_i];
      if (searchModel[key] !== '') {
        searchModel[key] = Array.isArray(this.state[key]) ? searchModel[key].split(',') : searchModel[key];
      }
      else {
        searchModel[key] = Array.isArray(this.state[key]) ? [] : searchModel[key];
      }
    }
    this.setState(searchModel);
  };
  BaseSearchComponent.prototype.toggleFilter = function (event) {
    this.hideFilter = !this.hideFilter;
  };
  BaseSearchComponent.prototype.showMessage = function (msg) {
    uione_2.storage.toast().showToast(msg);
  };
  BaseSearchComponent.prototype.mergeSearchModel = function (obj, arrs, b) {
    return search_utilities_1.mergeSearchModel(obj, this.pageSizes, arrs, b);
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
  BaseSearchComponent.prototype.getSearchModel = function () {
    var obj2 = this.ui.decodeFromForm(this.getSearchForm(), this.getLocale(), this.getCurrencyCode());
    var obj = obj2 ? obj2 : {};
    var obj3 = search_utilities_1.optimizeSearchModel(obj, this, this.getDisplayFields());
    obj3.excluding = this.excluding;
    return obj3;
  };
  BaseSearchComponent.prototype.getOriginalSearchModel = function () {
    return this.state;
  };
  BaseSearchComponent.prototype.getDisplayFields = function () {
    if (this.displayFields) {
      return this.displayFields;
    }
    if (!this.initDisplayFields) {
      if (this.form) {
        this.displayFields = search_utilities_1.getDisplayFields(this.form);
      }
      this.initDisplayFields = true;
    }
    return this.displayFields;
  };
  BaseSearchComponent.prototype.searchOnClick = function (event) {
    event.preventDefault();
    if (event && !this.getSearchForm()) {
      this.setSearchForm(event.target.form);
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
    if (listForm) {
      this.ui.removeFormError(listForm);
    }
    var s = this.getSearchModel();
    var com = this;
    this.validateSearch(s, function () {
      if (com.running === true) {
        return;
      }
      com.running = true;
      uione_2.storage.loading().showLoading();
      if (_this.ignoreUrlParam === false) {
        search_utilities_1.addParametersIntoUrl(s, isFirstLoad);
      }
      com.search(s);
    });
  };
  BaseSearchComponent.prototype.search = function (s) {
  };
  BaseSearchComponent.prototype.validateSearch = function (se, callback) {
    var valid = true;
    var listForm = this.getSearchForm();
    if (listForm) {
      valid = this.ui.validateForm(listForm, this.getLocale());
    }
    if (valid === true) {
      callback();
    }
  };
  BaseSearchComponent.prototype.searchError = function (err) {
    this.pageIndex = this.tmpPageIndex;
    this.handleError(err);
  };
  BaseSearchComponent.prototype.showResults = function (s, sr) {
    var com = this;
    var results = sr.results;
    if (results && results.length > 0) {
      var locale = this.getLocale();
      search_utilities_1.formatResults(results, this.formatter, locale, this.sequenceNo, this.pageIndex, this.pageSize, this.initPageSize);
    }
    var appendMode = com.appendMode;
    search_utilities_1.showResults(s, sr, com);
    if (appendMode === false) {
      com.setList(results);
      com.tmpPageIndex = s.page;
      var r = uione_2.storage.resource();
      var m1 = search_utilities_1.buildSearchMessage(s, sr, r);
      this.showMessage(m1);
    }
    else {
      if (com.append === true && s.page > 1) {
        com.appendList(results);
      }
      else {
        com.setList(results);
      }
    }
    com.running = false;
    uione_2.storage.loading().hideLoading();
    if (com.triggerSearch === true) {
      com.triggerSearch = false;
      com.resetAndSearch();
    }
  };
  BaseSearchComponent.prototype.appendList = function (results) {
    var _a;
    var list = this.state.results;
    var arr = search_utilities_1.append(list, results);
    var listForm = this.getSearchForm();
    var props = this.props;
    var setGlobalState = props.props.setGlobalState;
    if (setGlobalState && listForm) {
      setGlobalState((_a = {}, _a[listForm.name] = arr, _a));
    }
    else {
      this.setState({ results: arr });
    }
  };
  BaseSearchComponent.prototype.setList = function (results) {
    var _a;
    var props = this.props;
    var setGlobalState = props.props.setGlobalState;
    this.list = results;
    var listForm = this.getSearchForm();
    if (setGlobalState && listForm) {
      setGlobalState((_a = {}, _a[listForm.name] = results, _a));
    }
    else {
      this.setState({ results: results });
    }
  };
  BaseSearchComponent.prototype.getList = function () {
    return this.list;
  };
  BaseSearchComponent.prototype.sort = function (event) {
    event.preventDefault();
    search_utilities_1.handleSortEvent(event, this);
    if (this.appendMode === false) {
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
  function SearchComponent(props, service, listFormId) {
    var _this = _super.call(this, props, listFormId) || this;
    _this.service = service;
    _this.search = _this.search.bind(_this);
    _this.componentDidMount = _this.componentDidMount.bind(_this);
    _this.ref = React.createRef();
    return _this;
  }
  SearchComponent.prototype.componentDidMount = function () {
    this.form = uione_4.initForm(this.ref.current, uione_4.initMaterial);
    var s = this.mergeSearchModel(route_1.buildFromUrl());
    this.load(s, uione_2.storage.autoSearch);
  };
  SearchComponent.prototype.search = function (s) {
    return __awaiter(this, void 0, void 0, function () {
      var sr, err_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [4, this.service.search(s)];
          case 1:
            sr = _a.sent();
            this.showResults(s, sr);
            return [3, 3];
          case 2:
            err_2 = _a.sent();
            this.searchError(err_2);
            return [3, 3];
          case 3: return [2];
        }
      });
    });
  };
  return SearchComponent;
}(BaseSearchComponent));
exports.SearchComponent = SearchComponent;
var BaseEditComponent = (function (_super) {
  __extends(BaseEditComponent, _super);
  function BaseEditComponent(props, metadata, patchable, backOnSaveSuccess) {
    var _this = _super.call(this, props) || this;
    _this.metadata = metadata;
    _this.backOnSuccess = true;
    _this.newMode = false;
    _this.setBack = false;
    _this.patchable = true;
    _this.addable = true;
    _this.editable = true;
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
      var f = _this.form;
      setTimeout(function () {
        u.removeFormError(f);
      }, 100);
    };
    _this.saveOnClick = function (event) {
      event.preventDefault();
      event.persist();
      if (!_this.form && event && event.target) {
        _this.form = event.target.form;
      }
      _this.onSave(_this.backOnSuccess);
    };
    var meta = edit_1.build(metadata);
    _this.keys = meta.keys;
    _this.version = meta.version;
    _this.ui = uione_2.storage.ui();
    _this.showMessage = _this.showMessage.bind(_this);
    _this.confirm = _this.confirm.bind(_this);
    _this.resetState = _this.resetState.bind(_this);
    _this.handleNotFound = _this.handleNotFound.bind(_this);
    _this.getModelName = _this.getModelName.bind(_this);
    _this.getModel = _this.getModel.bind(_this);
    _this.showModel = _this.showModel.bind(_this);
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
    if (patchable === false) {
      _this.patchable = patchable;
    }
    if (backOnSaveSuccess === false) {
      _this.backOnSuccess = backOnSaveSuccess;
    }
    var r = uione_2.storage.resource();
    _this.insertSuccessMsg = r.value('msg_save_success');
    _this.updateSuccessMsg = r.value('msg_save_success');
    return _this;
  }
  BaseEditComponent.prototype.resetState = function (newMod, model, originalModel) {
    this.newMode = newMod;
    this.orginalModel = originalModel;
    this.showModel(model);
  };
  BaseEditComponent.prototype.handleNotFound = function (form) {
    var msg = uione_3.message(uione_2.storage.resource(), 'error_not_found', 'error');
    if (form) {
      form_util_1.readOnly(form);
    }
    this.alertError(msg.message, msg.title);
  };
  BaseEditComponent.prototype.getModelName = function () {
    return this.metadata.name;
  };
  BaseEditComponent.prototype.getModel = function () {
    return this.props[this.getModelName()] || this.state[this.getModelName()];
  };
  BaseEditComponent.prototype.showModel = function (model) {
    var _this = this;
    var f = this.form;
    var modelName = this.getModelName();
    var objSet = {};
    objSet[modelName] = model;
    this.setState(objSet, function () {
      if (_this.editable === false) {
        form_util_1.readOnly(f);
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
    var r = uione_2.storage.resource();
    if (this.newMode === true && this.addable === false) {
      var m = uione_3.message(r, 'error_permission_add', 'error_permission');
      this.alertError(m.message, m.title);
      return;
    }
    else if (this.newMode === false && this.editable === false) {
      var msg = uione_3.message(r, 'error_permission_edit', 'error_permission');
      this.alertError(msg.message, msg.title);
      return;
    }
    else {
      if (this.running === true) {
        return;
      }
      var com_1 = this;
      var obj_1 = com_1.getModel();
      if (this.newMode) {
        com_1.validate(obj_1, function () {
          var msg = uione_3.message(r, 'msg_confirm_save', 'confirm', 'yes', 'no');
          _this.confirm(msg.message, msg.title, function () {
            com_1.save(obj_1, null, isBack);
          }, msg.no, msg.yes);
        });
      }
      else {
        var diffObj_1 = reflectx_2.makeDiff(edit_1.initPropertyNullInModel(this.orginalModel, this.metadata), obj_1, this.keys, this.version);
        var keys = Object.keys(diffObj_1);
        if (keys.length === 0) {
          this.showMessage(r.value('msg_no_change'));
        }
        else {
          com_1.validate(obj_1, function () {
            var msg = uione_3.message(r, 'msg_confirm_save', 'confirm', 'yes', 'no');
            _this.confirm(msg.message, msg.title, function () {
              com_1.save(obj_1, diffObj_1, isBack);
            }, msg.no, msg.yes);
          });
        }
      }
    }
  };
  BaseEditComponent.prototype.confirm = function (msg, title, yesCallback, btnLeftText, btnRightText, noCallback) {
    uione_2.storage.alert().confirm(msg, title, yesCallback, btnLeftText, btnRightText, noCallback);
  };
  BaseEditComponent.prototype.validate = function (obj, callback) {
    var valid = this.ui.validateForm(this.form, this.getLocale());
    if (valid) {
      callback(obj);
    }
  };
  BaseEditComponent.prototype.save = function (obj, diff, isBack) {
  };
  BaseEditComponent.prototype.succeed = function (msg, isBack, result) {
    if (result) {
      var model = result.value;
      this.newMode = false;
      if (model && this.setBack === true) {
        this.resetState(false, model, reflectx_2.clone(model));
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
  BaseEditComponent.prototype.showMessage = function (msg) {
    uione_2.storage.toast().showToast(msg);
  };
  BaseEditComponent.prototype.fail = function (result) {
    var errors = result.errors;
    var f = this.form;
    var unmappedErrors = this.ui.showFormError(f, errors);
    form_util_1.focusFirstError(f);
    if (!result.message) {
      if (errors && errors.length === 1) {
        result.message = errors[0].message;
      }
      else {
        result.message = this.ui.buildErrorMessage(unmappedErrors);
      }
    }
    var t = this.resource['error'];
    this.alertError(result.message, t);
  };
  BaseEditComponent.prototype.postSave = function (res, backOnSave) {
    this.running = false;
    uione_2.storage.loading().hideLoading();
    var newMod = this.newMode;
    var successMsg = (newMod ? this.insertSuccessMsg : this.updateSuccessMsg);
    var x = res;
    if (!isNaN(x)) {
      if (x > 0) {
        this.succeed(successMsg, backOnSave);
      }
      else {
        if (newMod) {
          this.handleDuplicateKey();
        }
        else {
          this.handleNotFound();
        }
      }
    }
    else {
      var result = x;
      if (result.status === edit_1.Status.Success) {
        this.succeed(successMsg, backOnSave, result);
        this.showMessage(successMsg);
      }
      else if (result.status === edit_1.Status.Error) {
        this.fail(result);
      }
      else if (result.status === edit_1.Status.DuplicateKey) {
        this.handleDuplicateKey(result);
      }
      else {
        var r = uione_2.storage.resource();
        var msg = edit_1.buildMessageFromStatusCode(result.status, r);
        var title = r.value('error');
        if (msg && msg.length > 0) {
          this.alertError(msg, title);
        }
        else if (result.message && result.message.length > 0) {
          this.alertError(result.message, title);
        }
        else {
          this.alertError(r.value('error_internal'), title);
        }
      }
    }
  };
  BaseEditComponent.prototype.handleDuplicateKey = function (result) {
    var msg = uione_3.message(uione_2.storage.resource(), 'error_duplicate_key', 'error');
    this.alertError(msg.message, msg.title);
  };
  return BaseEditComponent;
}(BaseComponent));
exports.BaseEditComponent = BaseEditComponent;
var EditComponent = (function (_super) {
  __extends(EditComponent, _super);
  function EditComponent(props, service, patchable, backOnSaveSuccess) {
    var _this = _super.call(this, props, service.metadata(), patchable, backOnSaveSuccess) || this;
    _this.service = service;
    _this.load = _this.load.bind(_this);
    _this.save = _this.save.bind(_this);
    _this.componentDidMount = _this.componentDidMount.bind(_this);
    _this.ref = React.createRef();
    return _this;
  }
  EditComponent.prototype.componentDidMount = function () {
    this.form = uione_4.initForm(this.ref.current, uione_4.initMaterial);
    var id = core_1.buildId(this.keys, this.props);
    this.load(id);
  };
  EditComponent.prototype.load = function (_id) {
    return __awaiter(this, void 0, void 0, function () {
      var id, com, obj, err_3, obj;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            id = _id;
            com = this;
            if (!(id != null && id !== '')) return [3, 6];
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, 4, 5]);
            return [4, this.service.load(id)];
          case 2:
            obj = _a.sent();
            if (!obj) {
              com.handleNotFound(com.form);
            }
            com.resetState(false, obj, reflectx_2.clone(obj));
            return [3, 5];
          case 3:
            err_3 = _a.sent();
            if (err_3 && err_3.status === 404) {
              com.handleNotFound(com.form);
            }
            else {
              com.handleError(err_3);
            }
            return [3, 5];
          case 4:
            com.running = false;
            uione_2.storage.loading().hideLoading();
            return [7];
          case 5: return [3, 7];
          case 6:
            obj = this.createModel();
            this.resetState(true, obj, null);
            _a.label = 7;
          case 7: return [2];
        }
      });
    });
  };
  EditComponent.prototype.save = function (obj, body, isBack) {
    return __awaiter(this, void 0, void 0, function () {
      var isBackO, com, result, result, result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            this.running = true;
            uione_2.storage.loading().showLoading();
            isBackO = (isBack == null || isBack === undefined ? this.backOnSuccess : isBack);
            com = this;
            if (!(this.newMode === false)) return [3, 5];
            if (!(this.patchable === true && body && Object.keys(body).length > 0)) return [3, 2];
            return [4, this.service.patch(body)];
          case 1:
            result = _a.sent();
            com.postSave(result, isBackO);
            return [3, 4];
          case 2: return [4, this.service.update(obj)];
          case 3:
            result = _a.sent();
            com.postSave(result, isBackO);
            _a.label = 4;
          case 4: return [3, 7];
          case 5: return [4, this.service.insert(obj)];
          case 6:
            result = _a.sent();
            com.postSave(result, isBackO);
            _a.label = 7;
          case 7: return [2];
        }
      });
    });
  };
  return EditComponent;
}(BaseEditComponent));
exports.EditComponent = EditComponent;
