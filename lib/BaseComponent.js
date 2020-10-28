"use strict";
var __extends = (this && this.__extends) || (function (){
  var extendStatics = function (d, b){
    extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b){ d.__proto__ = b; }) ||
      function (d, b){ for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
  };
  return function (d, b){
    extendStatics(d, b);
    function __(){ this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
var __assign = (this && this.__assign) || function (){
  __assign = Object.assign || function(t){
    for (var s, i = 1, n = arguments.length; i < n; i++){
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator){
  function adopt(value){ return value instanceof P ? value : new P(function (resolve){ resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject){
    function fulfilled(value){ try { step(generator.next(value)); } catch (e){ reject(e); } }
    function rejected(value){ try { step(generator["throw"](value)); } catch (e){ reject(e); } }
    function step(result){ result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function (thisArg, body){
  var _ = { label: 0, sent: function(){ if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function(){ return this; }), g;
  function verb(n){ return function (v){ return step([n, v]); }; }
  function step(op){
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]){
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)){ _ = 0; continue; }
          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))){ _.label = op[1]; break; }
          if (op[0] === 6 && _.label < t[1]){ _.label = t[1]; t = op; break; }
          if (t && _.label < t[2]){ _.label = t[2]; _.ops.push(op); break; }
          if (t[2]) _.ops.pop();
          _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
    } catch (e){ op = [6, e]; y = 0; } finally { f = t = 0; }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_util_1 = require("form-util");
var React = require("react");
var reflectx_1 = require("reflectx");
var reflectx_2 = require("reflectx");
var search_utilities_1 = require("search-utilities");
var core_1 = require("./core");
var edit_1 = require("./edit");
var route_1 = require("./route");
var util_1 = require("./util");
exports.enLocale = {
  'localeId': 'en-US',
  'countryCode': 'US',
  'dateFormat': 'M/d/yyyy',
  'firstDayOfWeek': 1,
  'decimalSeparator': '.',
  'groupSeparator': ',',
  'decimalDigits': 2,
  'currencyCode': 'USD',
  'currencySymbol': '$',
  'currencyPattern': 0
};
var BaseViewComponent = (function (_super){
  __extends(BaseViewComponent, _super);
  function BaseViewComponent(props, resourceService, getLocale){
    var _this = _super.call(this, props) || this;
    _this.resourceService = resourceService;
    _this.getLocale = getLocale;
    _this.resource = {};
    _this.includingCurrencySymbol = false;
    _this.dateTimeFormat = null;
    _this.resource = resourceService.resource();
    if (getLocale){
      _this.getLocale = _this.getLocale.bind(_this);
    }
    _this.back = _this.back.bind(_this);
    return _this;
  }
  BaseViewComponent.prototype.currencySymbol = function (){
    return this.includingCurrencySymbol;
  };
  BaseViewComponent.prototype.getCurrencyCode = function (){
    return (this.form ? this.form.getAttribute('currency-code') : null);
  };
  BaseViewComponent.prototype.back = function (event){
    if (event){
      event.preventDefault();
    }
    this.props.history.goBack();
  };
  return BaseViewComponent;
}(React.Component));
exports.BaseViewComponent = BaseViewComponent;
var ViewComponent = (function (_super){
  __extends(ViewComponent, _super);
  function ViewComponent(props, service, resourceService, showError, getLocale, loading){
    var _this = _super.call(this, props, resourceService, getLocale) || this;
    _this.service = service;
    _this.showError = showError;
    _this.loading = loading;
    _this.metadata = service.metadata();
    _this.getModelName = _this.getModelName.bind(_this);
    _this.load = _this.load.bind(_this);
    _this.getModel = _this.getModel.bind(_this);
    _this.showModel = _this.showModel.bind(_this);
    _this.handleError = _this.handleError.bind(_this);
    return _this;
  }
  ViewComponent.prototype.getModelName = function (){
    return (this.metadata ? this.metadata.name : '');
  };
  ViewComponent.prototype.load = function (_id){
    return __awaiter(this, void 0, void 0, function (){
      var id, ctx, obj, err_1;
      return __generator(this, function (_a){
        switch (_a.label){
          case 0:
            id = _id;
            if (!(id != null && id !== '')) return [3, 5];
            this.running = true;
            if (this.loading){
              this.loading.showLoading();
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, 4, 5]);
            ctx = {};
            return [4, this.service.load(id, ctx)];
          case 2:
            obj = _a.sent();
            if (!obj){
              this.handleNotFound(this.form);
            }
            else {
              this.showModel(obj);
            }
            return [3, 5];
          case 3:
            err_1 = _a.sent();
            if (err_1 && err_1.status === 404){
              this.handleNotFound(this.form);
            }
            else {
              this.handleError(err_1);
            }
            return [3, 5];
          case 4:
            this.running = false;
            if (this.loading){
              this.loading.hideLoading();
            }
            return [7];
          case 5: return [2];
        }
      });
    });
  };
  ViewComponent.prototype.handleNotFound = function (form){
    var msg = core_1.message(this.resourceService, 'error_not_found', 'error');
    if (form){
      form_util_1.readOnly(form);
    }
    this.showError(msg.message, msg.title);
  };
  ViewComponent.prototype.getModel = function (){
    return this.state[this.getModelName()];
  };
  ViewComponent.prototype.showModel = function (model){
    var modelName = this.getModelName();
    var objSet = {};
    objSet[modelName] = model;
    this.setState(objSet);
  };
  ViewComponent.prototype.handleError = function (response){
    var r = this.resourceService;
    var title = r.value('error');
    var msg = r.value('error_internal');
    if (response){
      if (response.status && !isNaN(response.status)){
        msg = core_1.messageByHttpStatus(response.status, r);
      }
    }
    this.showError(msg, title);
  };
  return ViewComponent;
}(BaseViewComponent));
exports.ViewComponent = ViewComponent;
var BaseComponent = (function (_super){
  __extends(BaseComponent, _super);
  function BaseComponent(props, resourceService, ui, showError, getLocale, loading){
    var _this = _super.call(this, props, resourceService, getLocale) || this;
    _this.showError = showError;
    _this.loading = loading;
    _this.scrollToFocus = function (e, isUseTimeOut){
      if (isUseTimeOut === void 0){ isUseTimeOut = false; }
      try {
        var element = e.target;
        var container_1 = e.target.form.childNodes[1];
        var elementRect_1 = element.getBoundingClientRect();
        var absoluteElementTop = elementRect_1.top + window.pageYOffset;
        var middle_1 = absoluteElementTop - (window.innerHeight / 2);
        var scrollTop_1 = container_1.scrollTop;
        var timeOut = isUseTimeOut ? 300 : 0;
        var isChrome_1 = navigator.userAgent.search('Chrome') > 0;
        setTimeout(function (){
          if (isChrome_1){
            var scrollPosition = scrollTop_1 === 0 ? (elementRect_1.top + 64) : (scrollTop_1 + middle_1);
            container_1.scrollTo(0, Math.abs(scrollPosition));
          }
          else {
            container_1.scrollTo(0, Math.abs(scrollTop_1 + middle_1));
          }
        }, timeOut);
      }
      catch (e){
        console.log(e);
      }
    };
    _this.updatePhoneState = function (event){
      var re = /^[0-9\b]+$/;
      var value = core_1.removePhoneFormat(event.currentTarget.value);
      if (re.test(value) || !value){
        _this.updateState(event);
      }
      else {
        var splitArr = value.split('');
        var responseStr_1 = '';
        splitArr.forEach(function (element){
          if (re.test(element)){
            responseStr_1 += element;
          }
        });
        event.currentTarget.value = responseStr_1;
        _this.updateState(event);
      }
    };
    _this.updateDateState = function (name, value){
      var _a, _b, _c, _d, _e;
      var props = _this.props;
      var modelName = _this.form.getAttribute('model-name');
      var state = _this.state[modelName];
      if (props.setGlobalState){
        var data = props.shouldBeCustomized ? _this.prepareCustomData((_a = {}, _a[name] = value, _a)) : (_b = {}, _b[name] = value, _b);
        props.setGlobalState((_c = {}, _c[modelName] = __assign(__assign({}, state), data), _c));
      }
      else {
        _this.setState((_d = {}, _d[modelName] = __assign(__assign({}, state), (_e = {}, _e[name] = value, _e)), _d));
      }
    };
    _this.updateState = function (e, callback, locale){
      var _a, _b, _c, _d;
      var props = _this.props;
      var ctrl = e.currentTarget;
      var updateStateMethod = props.setGlobalState;
      var modelName = ctrl.form.getAttribute('model-name');
      var propsDataForm = props[modelName];
      var type = ctrl.getAttribute('type');
      var isPreventDefault = type && (['checkbox', 'radio'].indexOf(type.toLowerCase()) >= 0 ? false : true);
      if (isPreventDefault){
        e.preventDefault();
      }
      if (ctrl.nodeName === 'SELECT' &&
        ctrl.value &&
        ctrl.classList.contains('invalid')){
        _this.uiS1.removeErrorMessage(ctrl);
      }
      if (updateStateMethod){
        var form = ctrl.form;
        var formName = form.name;
        if (!locale){
          if (_this.getLocale){
            locale = _this.getLocale();
          }
          else {
            locale = exports.enLocale;
          }
        }
        var res = util_1.valueOf(ctrl, locale, e.type);
        if (res.mustChange){
          var dataField = ctrl.getAttribute('data-field');
          var field = (dataField ? dataField : ctrl.name);
          if (field.indexOf('.') < 0 && field.indexOf('[') < 0){
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
        if (form){
          if (modelName && modelName !== ''){
            var ex = _this.state[modelName];
            var dataField = ctrl.getAttribute('data-field');
            var field = (dataField ? dataField : ctrl.name);
            var model = Object.assign({}, ex);
            if (type && type.toLowerCase() === 'checkbox'){
              var ctrlOnValue = ctrl.getAttribute('data-on-value');
              var ctrlOffValue = ctrl.getAttribute('data-off-value');
              var onValue = ctrlOnValue ? ctrlOnValue : true;
              var offValue = ctrlOffValue ? ctrlOffValue : false;
              model[field] = ctrl.checked ? onValue : offValue;
              var objSet = {};
              objSet[modelName] = model;
              if (callback){
                _this.setState(objSet, callback);
              }
              else {
                _this.setState(objSet);
              }
            }
            else if (type && type.toLowerCase() === 'radio'){
              if (field.indexOf('.') < 0 && field.indexOf('[') < 0){
                model[field] = ctrl.value;
              }
              else {
                reflectx_1.setValue(model, field, ctrl.value);
              }
              var objSet = {};
              objSet[modelName] = model;
              if (callback){
                _this.setState(objSet, callback);
              }
              else {
                _this.setState(objSet);
              }
            }
            else {
              var tmLoc = null;
              if (_this.getLocale){
                tmLoc = _this.getLocale();
              }
              else {
                tmLoc = exports.enLocale;
              }
              var tloc = (!locale ? tmLoc : locale);
              var data = util_1.valueOf(ctrl, tloc, e.type);
              if (data.mustChange){
                if (field.indexOf('.') < 0 && field.indexOf('[') < 0){
                  model[field] = data.value;
                }
                else {
                  reflectx_1.setValue(model, field, data.value);
                }
                var objSet = {};
                objSet[modelName] = model;
                if (callback){
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
    _this.uiS1 = ui;
    _this.showError = _this.showError.bind(_this);
    _this.updateState = _this.updateState.bind(_this);
    _this.updateFlatState = _this.updateFlatState.bind(_this);
    _this.updatePhoneState = _this.updatePhoneState.bind(_this);
    _this.updateDateState = _this.updateDateState.bind(_this);
    _this.prepareCustomData = _this.prepareCustomData.bind(_this);
    _this.handleError = _this.handleError.bind(_this);
    return _this;
  }
  BaseComponent.prototype.prepareCustomData = function (data){ };
  BaseComponent.prototype.updateFlatState = function (e, callback, locale){
    var _a;
    var ctrl = e.currentTarget;
    var stateName = ctrl.name;
    var objSet = {};
    var type = ctrl.getAttribute('type');
    if (type && type.toLowerCase() === 'checkbox'){
      if (ctrl.id && stateName === ctrl.id){
        var origin_1 = this.state[stateName];
        objSet[stateName] = (origin_1 ? !origin_1 : true);
        this.setState(objSet);
      }
      else {
        var value = this.state[stateName];
        value.includes(ctrl.value) ? value = value.filter(function (v){ return v !== ctrl.value; }) : value.push(ctrl.value);
        this.setState((_a = {}, _a[ctrl.name] = value, _a));
      }
    }
    else {
      var tloc = (!locale ? this.getLocale() : locale);
      var data = util_1.valueOf(ctrl, tloc, e.type);
      if (data.mustChange){
        objSet[stateName] = data.value;
        if (callback){
          this.setState(objSet, callback);
        }
        else {
          this.setState(objSet);
        }
      }
    }
  };
  BaseComponent.prototype.handleError = function (response){
    this.running = false;
    if (this.loading){
      this.loading.hideLoading();
    }
    var r = this.resourceService;
    var title = r.value('error');
    var msg = r.value('error_internal');
    if (!response){
      this.showError(msg, title);
      return;
    }
    var status = response.status;
    if (status && !isNaN(status)){
      msg = core_1.messageByHttpStatus(status, r);
    }
    if (status === 403){
      msg = r.value('error_forbidden');
      form_util_1.readOnly(this.form);
      this.showError(msg, title);
    }
    else if (status === 401){
      msg = r.value('error_unauthorized');
      form_util_1.readOnly(this.form);
      this.showError(msg, title);
    }
    else {
      this.showError(msg, title);
    }
  };
  return BaseComponent;
}(BaseViewComponent));
exports.BaseComponent = BaseComponent;
var BaseSearchComponent = (function (_super){
  __extends(BaseSearchComponent, _super);
  function BaseSearchComponent(props, resourceService, ui, showMessage, showError, getLocale, loading, listFormId){
    var _this = _super.call(this, props, resourceService, ui, showError, getLocale) || this;
    _this.ui = ui;
    _this.showMessage = showMessage;
    _this.listFormId = listFormId;
    _this.initPageSize = 20;
    _this.pageSize = 20;
    _this.pageIndex = 1;
    _this.itemTotal = 0;
    _this.pageTotal = 0;
    _this.showPaging = false;
    _this.append = false;
    _this.appendMode = false;
    _this.appendable = false;
    _this.initDisplayFields = false;
    _this.sequenceNo = 'sequenceNo';
    _this.triggerSearch = false;
    _this.tmpPageIndex = 1;
    _this.pageMaxSize = 7;
    _this.pageSizes = [10, 20, 40, 60, 100, 200, 400, 800];
    _this.ignoreUrlParam = false;
    _this.viewable = true;
    _this.addable = true;
    _this.editable = true;
    _this.approvable = true;
    _this.deletable = true;
    _this.add = function (event){
      event.preventDefault();
      var url = _this.props['props'].match.url + '/add';
      _this.props.history.push(url);
    };
    _this.pagingOnClick = function (size, e){
      _this.setState(function (prevState){ return ({ isPageSizeOpenDropDown: !prevState.isPageSizeOpenDropDown }); });
      _this.pageSizeChanged(size);
    };
    _this.pageSizeOnClick = function (){
      _this.setState(function (prevState){ return ({ isPageSizeOpenDropDown: !prevState.isPageSizeOpenDropDown }); });
    };
    _this.pageSizeChanged = function (event){
      var size = parseInt(event.currentTarget.value, null);
      search_utilities_1.changePageSize(_this, size);
      _this.tmpPageIndex = 1;
      _this.doSearch();
    };
    _this.ui = ui;
    _this.showMessage = _this.showMessage.bind(_this);
    _this.toggleFilter = _this.toggleFilter.bind(_this);
    _this.mergeUrlSearchModel = _this.mergeUrlSearchModel.bind(_this);
    _this.mergeSearchModel = _this.mergeSearchModel.bind(_this);
    _this.load = _this.load.bind(_this);
    _this.add = _this.add.bind(_this);
    _this.getSearchForm = _this.getSearchForm.bind(_this);
    _this.setSearchForm = _this.setSearchForm.bind(_this);
    _this.setSearchModel = _this.setSearchModel.bind(_this);
    _this.getOriginalSearchModel = _this.getOriginalSearchModel.bind(_this);
    _this.getSearchModel = _this.getSearchModel.bind(_this);
    _this.getDisplayFields = _this.getDisplayFields.bind(_this);
    _this.pageSizeChanged = _this.pageSizeChanged.bind(_this);
    _this.clearKeyword = _this.clearKeyword.bind(_this);
    _this.searchOnClick = _this.searchOnClick.bind(_this);
    _this.resetAndSearch = _this.resetAndSearch.bind(_this);
    _this.doSearch = _this.doSearch.bind(_this);
    _this.search = _this.search.bind(_this);
    _this.validateSearch = _this.validateSearch.bind(_this);
    _this.showResults = _this.showResults.bind(_this);
    _this.searchError = _this.searchError.bind(_this);
    _this.setList = _this.setList.bind(_this);
    _this.getList = _this.getList.bind(_this);
    _this.sort = _this.sort.bind(_this);
    _this.showMore = _this.showMore.bind(_this);
    _this.pageChanged = _this.pageChanged.bind(_this);
    _this.url = (props.match ? props.match.url : props['props'].match.url);
    return _this;
  }
  BaseSearchComponent.prototype.mergeUrlSearchModel = function (searchModel){
    for (var _i = 0, _a = Object.keys(searchModel); _i < _a.length; _i++){
      var key = _a[_i];
      if (searchModel[key] !== ''){
        searchModel[key] = Array.isArray(this.state[key]) ? searchModel[key].split(',') : searchModel[key];
      }
      else {
        searchModel[key] = Array.isArray(this.state[key]) ? [] : searchModel[key];
      }
    }
    this.setState(searchModel);
  };
  BaseSearchComponent.prototype.toggleFilter = function (event){
    this.hideFilter = !this.hideFilter;
  };
  BaseSearchComponent.prototype.mergeSearchModel = function (obj, arrs, b){
    return search_utilities_1.mergeSearchModel(obj, this.pageSizes, arrs, b);
  };
  BaseSearchComponent.prototype.load = function (s, autoSearch){
    var obj2 = search_utilities_1.initSearchable(s, this);
    this.setSearchModel(obj2);
    var com = this;
    if (autoSearch){
      setTimeout(function (){
        com.doSearch(true);
      }, 0);
    }
  };
  BaseSearchComponent.prototype.setSearchForm = function (form){
    this.form = form;
  };
  BaseSearchComponent.prototype.getSearchForm = function (){
    if (!this.form && this.listFormId){
      this.form = document.getElementById(this.listFormId);
    }
    return this.form;
  };
  BaseSearchComponent.prototype.setSearchModel = function (searchModel){
    this.setState(searchModel);
  };
  BaseSearchComponent.prototype.getSearchModel = function (){
    var obj2 = this.ui.decodeFromForm(this.getSearchForm(), this.getLocale(), this.getCurrencyCode());
    var obj = obj2 ? obj2 : {};
    var obj3 = search_utilities_1.optimizeSearchModel(obj, this, this.getDisplayFields());
    obj3.excluding = this.excluding;
    return obj3;
  };
  BaseSearchComponent.prototype.getOriginalSearchModel = function (){
    return this.state;
  };
  BaseSearchComponent.prototype.getDisplayFields = function (){
    if (this.displayFields){
      return this.displayFields;
    }
    if (!this.initDisplayFields){
      if (this.form){
        this.displayFields = search_utilities_1.getDisplayFields(this.form);
      }
      this.initDisplayFields = true;
    }
    return this.displayFields;
  };
  BaseSearchComponent.prototype.clearKeyword = function (){
    this.setState({
      keyword: ''
    });
  };
  BaseSearchComponent.prototype.searchOnClick = function (event){
    event.preventDefault();
    if (event && !this.getSearchForm()){
      this.setSearchForm(event.target.form);
    }
    this.resetAndSearch();
  };
  BaseSearchComponent.prototype.resetAndSearch = function (){
    this.pageIndex = 1;
    if (this.running === true){
      this.triggerSearch = true;
      return;
    }
    search_utilities_1.reset(this);
    this.tmpPageIndex = 1;
    this.doSearch();
  };
  BaseSearchComponent.prototype.doSearch = function (isFirstLoad){
    var _this = this;
    var listForm = this.getSearchForm();
    if (listForm){
      this.ui.removeFormError(listForm);
    }
    var s = this.getSearchModel();
    var com = this;
    this.validateSearch(s, function (){
      if (com.running === true){
        return;
      }
      com.running = true;
      if (_this.loading){
        _this.loading.showLoading();
      }
      if (_this.ignoreUrlParam === false){
        search_utilities_1.addParametersIntoUrl(s, isFirstLoad);
      }
      com.search(s);
    });
  };
  BaseSearchComponent.prototype.search = function (s){
  };
  BaseSearchComponent.prototype.validateSearch = function (se, callback){
    var valid = true;
    var listForm = this.getSearchForm();
    if (listForm){
      valid = this.ui.validateForm(listForm, this.getLocale());
    }
    if (valid === true){
      callback();
    }
  };
  BaseSearchComponent.prototype.searchError = function (err){
    this.pageIndex = this.tmpPageIndex;
    this.handleError(err);
  };
  BaseSearchComponent.prototype.showResults = function (s, sr){
    var com = this;
    var results = sr.results;
    if (results && results.length > 0){
      var locale = this.getLocale();
      search_utilities_1.formatResults(results, this.formatter, locale, this.sequenceNo, this.pageIndex, this.pageSize, this.initPageSize);
    }
    var appendMode = com.appendMode;
    search_utilities_1.showResults(s, sr, com);
    if (appendMode === false){
      com.setList(results);
      com.tmpPageIndex = s.page;
      var m1 = search_utilities_1.buildSearchMessage(s, sr, this.resourceService);
      this.showMessage(m1);
    }
    else {
      if (com.append === true && s.page > 1){
        com.appendList(results);
      }
      else {
        com.setList(results);
      }
    }
    com.running = false;
    if (this.loading){
      this.loading.hideLoading();
    }
    if (com.triggerSearch === true){
      com.triggerSearch = false;
      com.resetAndSearch();
    }
  };
  BaseSearchComponent.prototype.appendList = function (results){
    var _a;
    var list = this.state.results;
    var arr = search_utilities_1.append(list, results);
    var listForm = this.getSearchForm();
    var props = this.props;
    var setGlobalState = props.props.setGlobalState;
    if (setGlobalState && listForm){
      setGlobalState((_a = {}, _a[listForm.name] = arr, _a));
    }
    else {
      this.setState({ results: arr });
    }
  };
  BaseSearchComponent.prototype.setList = function (results){
    var _a;
    var props = this.props;
    var setGlobalState = props.props.setGlobalState;
    this.list = results;
    var listForm = this.getSearchForm();
    if (setGlobalState && listForm){
      setGlobalState((_a = {}, _a[listForm.name] = results, _a));
    }
    else {
      this.setState({ results: results });
    }
  };
  BaseSearchComponent.prototype.getList = function (){
    return this.list;
  };
  BaseSearchComponent.prototype.sort = function (event){
    event.preventDefault();
    search_utilities_1.handleSortEvent(event, this);
    if (this.appendMode === false){
      this.doSearch();
    }
    else {
      this.resetAndSearch();
    }
  };
  BaseSearchComponent.prototype.showMore = function (event){
    event.preventDefault();
    this.tmpPageIndex = this.pageIndex;
    search_utilities_1.more(this);
    this.doSearch();
  };
  BaseSearchComponent.prototype.pageChanged = function (data){
    var currentPage = data.currentPage, itemsPerPage = data.itemsPerPage;
    search_utilities_1.changePage(this, currentPage, itemsPerPage);
    this.doSearch();
  };
  return BaseSearchComponent;
}(BaseComponent));
exports.BaseSearchComponent = BaseSearchComponent;
var SearchComponent = (function (_super){
  __extends(SearchComponent, _super);
  function SearchComponent(props, service, resourceService, ui, showMessage, showError, getLocale, loading, autoSearch, listFormId){
    var _this = _super.call(this, props, resourceService, ui, showMessage, showError, getLocale, loading, listFormId) || this;
    _this.service = service;
    _this.autoSearch = true;
    if (autoSearch === false){
      _this.autoSearch = autoSearch;
    }
    _this.search = _this.search.bind(_this);
    _this.componentDidMount = _this.componentDidMount.bind(_this);
    _this.ref = React.createRef();
    return _this;
  }
  SearchComponent.prototype.componentDidMount = function (){
    this.form = core_1.initForm(this.ref.current, this.ui.initMaterial);
    var s = this.mergeSearchModel(route_1.buildFromUrl());
    this.load(s, this.autoSearch);
  };
  SearchComponent.prototype.search = function (s){
    return __awaiter(this, void 0, void 0, function (){
      var ctx, sr, err_2;
      return __generator(this, function (_a){
        switch (_a.label){
          case 0:
            _a.trys.push([0, 2, , 3]);
            ctx = {};
            return [4, this.service.search(s, ctx)];
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
var BaseEditComponent = (function (_super){
  __extends(BaseEditComponent, _super);
  function BaseEditComponent(props, metadata, resourceService, ui, showMessage, showError, confirm, getLocale, loading, patchable, backOnSaveSuccess){
    var _this = _super.call(this, props, resourceService, ui, showError, getLocale, loading) || this;
    _this.metadata = metadata;
    _this.ui = ui;
    _this.showMessage = showMessage;
    _this.confirm = confirm;
    _this.backOnSuccess = true;
    _this.newMode = false;
    _this.setBack = false;
    _this.patchable = true;
    _this.addable = true;
    _this.editable = true;
    _this.newOnClick = function (event){
      if (event){
        event.preventDefault();
      }
      if (!_this.form && event && event.target && event.target.form){
        _this.form = event.target.form;
      }
      var obj = _this.createModel();
      _this.resetState(true, obj, null);
      var u = _this.ui;
      var f = _this.form;
      setTimeout(function (){
        u.removeFormError(f);
      }, 100);
    };
    _this.saveOnClick = function (event){
      event.preventDefault();
      event.persist();
      if (!_this.form && event && event.target){
        _this.form = event.target.form;
      }
      _this.onSave(_this.backOnSuccess);
    };
    var meta = edit_1.build(metadata);
    _this.keys = meta.keys;
    _this.version = meta.version;
    _this.ui = ui;
    if (patchable === false){
      _this.patchable = patchable;
    }
    if (backOnSaveSuccess === false){
      _this.backOnSuccess = backOnSaveSuccess;
    }
    _this.insertSuccessMsg = resourceService.value('msg_save_success');
    _this.updateSuccessMsg = resourceService.value('msg_save_success');
    _this.showMessage = _this.showMessage.bind(_this);
    _this.confirm = _this.confirm.bind(_this);
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
  BaseEditComponent.prototype.resetState = function (newMod, model, originalModel){
    this.newMode = newMod;
    this.orginalModel = originalModel;
    this.showModel(model);
  };
  BaseEditComponent.prototype.handleNotFound = function (form){
    var msg = core_1.message(this.resourceService, 'error_not_found', 'error');
    if (form){
      form_util_1.readOnly(form);
    }
    this.showError(msg.message, msg.title);
  };
  BaseEditComponent.prototype.getModelName = function (){
    return this.metadata.name;
  };
  BaseEditComponent.prototype.getModel = function (){
    var n = this.getModelName();
    return this.props[n] || this.state[n];
  };
  BaseEditComponent.prototype.showModel = function (model){
    var _this = this;
    var f = this.form;
    var modelName = this.getModelName();
    var objSet = {};
    objSet[modelName] = model;
    this.setState(objSet, function (){
      if (_this.editable === false){
        form_util_1.readOnly(f);
      }
    });
  };
  BaseEditComponent.prototype.createModel = function (){
    if (this.metadata){
      var obj = edit_1.createModel(this.metadata);
      return obj;
    }
    else {
      var obj = {};
      return obj;
    }
  };
  BaseEditComponent.prototype.onSave = function (isBack){
    var _this = this;
    var r = this.resourceService;
    if (this.newMode === true && this.addable === false){
      var m = core_1.message(r, 'error_permission_add', 'error_permission');
      this.showError(m.message, m.title);
      return;
    }
    else if (this.newMode === false && this.editable === false){
      var msg = core_1.message(r, 'error_permission_edit', 'error_permission');
      this.showError(msg.message, msg.title);
      return;
    }
    else {
      if (this.running === true){
        return;
      }
      var com_1 = this;
      var obj_1 = com_1.getModel();
      if (this.newMode){
        com_1.validate(obj_1, function (){
          var msg = core_1.message(r, 'msg_confirm_save', 'confirm', 'yes', 'no');
          _this.confirm(msg.message, msg.title, function (){
            com_1.save(obj_1, obj_1, isBack);
          }, msg.no, msg.yes);
        });
      }
      else {
        var diffObj_1 = reflectx_2.makeDiff(edit_1.initPropertyNullInModel(this.orginalModel, this.metadata), obj_1, this.keys, this.version);
        var keys = Object.keys(diffObj_1);
        if (keys.length === 0){
          this.showMessage(r.value('msg_no_change'));
        }
        else {
          com_1.validate(obj_1, function (){
            var msg = core_1.message(r, 'msg_confirm_save', 'confirm', 'yes', 'no');
            _this.confirm(msg.message, msg.title, function (){
              com_1.save(obj_1, diffObj_1, isBack);
            }, msg.no, msg.yes);
          });
        }
      }
    }
  };
  BaseEditComponent.prototype.validate = function (obj, callback){
    var valid = this.ui.validateForm(this.form, this.getLocale());
    if (valid){
      callback(obj);
    }
  };
  BaseEditComponent.prototype.save = function (obj, diff, isBack){
  };
  BaseEditComponent.prototype.succeed = function (msg, isBack, result){
    if (result){
      var model = result.value;
      this.newMode = false;
      if (model && this.setBack === true){
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
    if (isBackO){
      this.back(null);
    }
  };
  BaseEditComponent.prototype.successMessage = function (msg){
    this.showMessage(msg);
  };
  BaseEditComponent.prototype.fail = function (result){
    var errors = result.errors;
    var f = this.form;
    var unmappedErrors = this.ui.showFormError(f, errors);
    form_util_1.focusFirstError(f);
    if (!result.message){
      if (errors && errors.length === 1){
        result.message = errors[0].message;
      }
      else {
        result.message = this.ui.buildErrorMessage(unmappedErrors);
      }
    }
    var t = this.resource['error'];
    this.showError(result.message, t);
  };
  BaseEditComponent.prototype.postSave = function (res, backOnSave){
    this.running = false;
    if (this.loading){
      this.loading.hideLoading();
    }
    var newMod = this.newMode;
    var successMsg = (newMod ? this.insertSuccessMsg : this.updateSuccessMsg);
    var x = res;
    if (!isNaN(x)){
      if (x > 0){
        this.succeed(successMsg, backOnSave);
      }
      else {
        if (newMod){
          this.handleDuplicateKey();
        }
        else {
          this.handleNotFound();
        }
      }
    }
    else {
      var result = x;
      if (result.status === edit_1.Status.Success){
        this.succeed(successMsg, backOnSave, result);
        this.showMessage(successMsg);
      }
      else if (result.status === edit_1.Status.Error){
        this.fail(result);
      }
      else if (result.status === edit_1.Status.DuplicateKey){
        this.handleDuplicateKey(result);
      }
      else {
        var r = this.resourceService;
        var msg = edit_1.buildMessageFromStatusCode(result.status, r);
        var title = r.value('error');
        if (msg && msg.length > 0){
          this.showError(msg, title);
        }
        else if (result.message && result.message.length > 0){
          this.showError(result.message, title);
        }
        else {
          this.showError(r.value('error_internal'), title);
        }
      }
    }
  };
  BaseEditComponent.prototype.handleDuplicateKey = function (result){
    var msg = core_1.message(this.resourceService, 'error_duplicate_key', 'error');
    this.showError(msg.message, msg.title);
  };
  return BaseEditComponent;
}(BaseComponent));
exports.BaseEditComponent = BaseEditComponent;
var EditComponent = (function (_super){
  __extends(EditComponent, _super);
  function EditComponent(props, service, resourceService, ui, showMessage, showError, confirm, getLocale, loading, patchable, backOnSaveSuccess){
    var _this = _super.call(this, props, service.metadata(), resourceService, ui, showMessage, showError, confirm, getLocale, loading, patchable, backOnSaveSuccess) || this;
    _this.service = service;
    _this.load = _this.load.bind(_this);
    _this.save = _this.save.bind(_this);
    _this.componentDidMount = _this.componentDidMount.bind(_this);
    _this.ref = React.createRef();
    return _this;
  }
  EditComponent.prototype.componentDidMount = function (){
    this.form = core_1.initForm(this.ref.current, this.ui.initMaterial);
    var id = core_1.buildId(this.keys, this.props);
    this.load(id);
  };
  EditComponent.prototype.load = function (_id){
    return __awaiter(this, void 0, void 0, function (){
      var id, com, ctx, obj, err_3, data, obj;
      return __generator(this, function (_a){
        switch (_a.label){
          case 0:
            id = _id;
            com = this;
            if (!(id != null && id !== '')) return [3, 6];
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, 4, 5]);
            this.running = true;
            if (this.loading){
              this.loading.showLoading();
            }
            ctx = {};
            return [4, this.service.load(id, ctx)];
          case 2:
            obj = _a.sent();
            if (!obj){
              com.handleNotFound(com.form);
            }
            else {
              com.resetState(false, obj, reflectx_2.clone(obj));
            }
            return [3, 5];
          case 3:
            err_3 = _a.sent();
            data = (err_3 && err_3.response) ? err_3.response : err_3;
            if (data && data.status === 404){
              com.handleNotFound(this.form);
            }
            else {
              com.handleError(err_3);
            }
            return [3, 5];
          case 4:
            com.running = false;
            if (this.loading){
              this.loading.hideLoading();
            }
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
  EditComponent.prototype.save = function (obj, body, isBack){
    return __awaiter(this, void 0, void 0, function (){
      var isBackO, com, ctx, result, result, result, err_4;
      return __generator(this, function (_a){
        switch (_a.label){
          case 0:
            this.running = true;
            if (this.loading){
              this.loading.showLoading();
            }
            isBackO = (isBack == null || isBack === undefined ? this.backOnSuccess : isBack);
            com = this;
            _a.label = 1;
          case 1:
            _a.trys.push([1, 9, , 10]);
            ctx = {};
            if (!!this.newMode) return [3, 6];
            if (!(this.patchable === true && body && Object.keys(body).length > 0)) return [3, 3];
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
          case 8: return [3, 10];
          case 9:
            err_4 = _a.sent();
            this.handleError(err_4);
            return [3, 10];
          case 10: return [2];
        }
      });
    });
  };
  return EditComponent;
}(BaseEditComponent));
exports.EditComponent = EditComponent;
