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
var core_1 = require("./core");
var formutil_1 = require("./formutil");
var merge_1 = require("./merge");
var router_1 = require("./router");
exports.useBaseView = function (props, refForm, initialState, service, p1, p2) {
  var p4 = (p2 ? p2 : {});
  var p6 = {
    props: props,
    refForm: refForm,
    initialState: initialState,
    service: service,
    resourceService: p1.resource,
    showError: p1.showError,
    getLocale: p1.getLocale,
    loading: p1.loading,
    metadata: p4.metadata,
    handleNotFound: p4.handleNotFound,
    getModelName: p4.getModelName,
    showModel: p4.showModel,
    load: p4.load
  };
  return exports.useBaseViewOne(p6);
};
exports.useView = function (props, refForm, initialState, service, p1, p2) {
  var p4 = (p2 ? p2 : {});
  var p = {
    props: props,
    refForm: refForm,
    keys: p4.keys,
    initialize: p4.initialize,
    callback: p4.callback,
    initialState: initialState,
    service: service,
    resourceService: p1.resource,
    showError: p1.showError,
    getLocale: p1.getLocale,
    loading: p1.loading,
    metadata: p4.metadata,
    handleNotFound: p4.handleNotFound,
    getModelName: p4.getModelName,
    showModel: p4.showModel,
    load: p4.load
  };
  return exports.useViewOne(p);
};
exports.useViewOne = function (p) {
  var baseProps = exports.useBaseViewOne(p);
  var _a = merge_1.useMergeState(p.initialState), state = _a[0], setState = _a[1];
  react_1.useEffect(function () {
    if (baseProps.refForm) {
      core_1.initForm(baseProps.refForm.current);
    }
    var id = core_1.buildId(p.props, p.keys);
    if (p && p.initialize) {
      p.initialize(id, baseProps.load, setState, p.callback);
    }
    else {
      baseProps.load(id, p.callback);
    }
  }, []);
  return __assign({}, baseProps);
};
exports.useBaseViewOne = function (p) {
  var _a = merge_1.useMergeState(p.initialState), state = _a[0], setState = _a[1];
  var _b = react_1.useState(undefined), running = _b[0], setRunning = _b[1];
  var goBack = router_1.useRouter().goBack;
  var back = function (event) {
    if (event) {
      event.preventDefault();
    }
    goBack();
  };
  var getModelName = function (f) {
    if (p.metadata) {
      return p.metadata.name;
    }
    if (typeof p.service !== 'function' && p.service.metadata) {
      var metadata = p.service.metadata();
      if (metadata) {
        return metadata.name;
      }
    }
    return core_1.getModelName(f);
  };
  var showModel = function (model) {
    var n = getModelName(p.refForm.current);
    var objSet = {};
    objSet[n] = model;
    setState(objSet);
  };
  var _handleNotFound = function (form) {
    var msg = core_1.message(p.resourceService.value, 'error_not_found', 'error');
    if (form) {
      formutil_1.readOnly(form);
    }
    p.showError(msg.message, msg.title);
  };
  var handleNotFound = (p.handleNotFound ? p.handleNotFound : _handleNotFound);
  var _load = function (_id, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var id, obj, err_1, data, r, title, msg;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          id = _id;
          if (!(id != null && id !== '')) return [3, 8];
          _a.label = 1;
        case 1:
          _a.trys.push([1, 6, 7, 8]);
          obj = void 0;
          if (!(typeof p.service === 'function')) return [3, 3];
          return [4, p.service(id)];
        case 2:
          obj = _a.sent();
          return [3, 5];
        case 3: return [4, p.service.load(id)];
        case 4:
          obj = _a.sent();
          _a.label = 5;
        case 5:
          if (!obj) {
            handleNotFound(p.refForm.current);
          }
          else {
            if (callback) {
              callback(obj, showModel);
            }
            else {
              showModel(obj);
            }
          }
          return [3, 8];
        case 6:
          err_1 = _a.sent();
          data = (err_1 && err_1.response) ? err_1.response : err_1;
          r = p.resourceService;
          title = r.value('error');
          msg = r.value('error_internal');
          if (data && data.status === 404) {
            handleNotFound(p.refForm.current);
          }
          else {
            if (data && data.status) {
              msg = core_1.messageByHttpStatus(data.status, r.value);
            }
            formutil_1.readOnly(p.refForm.current);
            p.showError(msg, title);
          }
          return [3, 8];
        case 7:
          setRunning(false);
          if (p.loading) {
            p.loading.hideLoading();
          }
          return [7];
        case 8: return [2];
      }
    });
  }); };
  var load = (p.load ? p.load : _load);
  return {
    state: state,
    setState: setState,
    refForm: p.refForm,
    resource: p.resourceService.resource(),
    running: running,
    setRunning: setRunning,
    showModel: showModel,
    getModelName: getModelName,
    handleNotFound: handleNotFound,
    load: load,
    back: back
  };
};
