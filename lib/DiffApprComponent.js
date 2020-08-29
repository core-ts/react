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
var form_util_1 = require("form-util");
var React = require("react");
var reflectx_1 = require("reflectx");
var uione_1 = require("uione");
var uione_2 = require("uione");
var core_1 = require("./core");
var Status;
(function (Status) {
  Status[Status["NotFound"] = 0] = "NotFound";
  Status[Status["Success"] = 1] = "Success";
  Status[Status["VersionError"] = 2] = "VersionError";
  Status[Status["Error"] = 4] = "Error";
})(Status || (Status = {}));
var BaseDiffApprComponent = (function (_super) {
  __extends(BaseDiffApprComponent, _super);
  function BaseDiffApprComponent(props, metadata) {
    var _this = _super.call(this, props) || this;
    _this.metadata = metadata;
    _this.id = null;
    _this.resource = uione_1.storage.getResource();
    _this.showMessage = _this.showMessage.bind(_this);
    _this.alertError = _this.alertError.bind(_this);
    _this.back = _this.back.bind(_this);
    _this.initModel = _this.initModel.bind(_this);
    _this.postApprove = _this.postApprove.bind(_this);
    _this.postReject = _this.postReject.bind(_this);
    _this.format = _this.format.bind(_this);
    _this.handleError = _this.handleError.bind(_this);
    _this.handleNotFound = _this.handleNotFound.bind(_this);
    _this.keys = core_1.buildKeys(metadata);
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
  BaseDiffApprComponent.prototype.postApprove = function (status, err) {
    this.setState({ disabled: true });
    var r = uione_1.storage.resource();
    if (status === Status.Success) {
      this.showMessage(r.value('msg_approve_success'));
    }
    else if (status === Status.VersionError) {
      var msg = uione_2.message(uione_1.storage.resource(), 'msg_approve_version_error', 'error');
      this.alertError(msg.message, msg.title);
    }
    else if (status === Status.NotFound) {
      this.handleNotFound();
    }
    else {
      this.handleError(err);
    }
  };
  BaseDiffApprComponent.prototype.postReject = function (status, err) {
    this.setState({ disabled: true });
    var r = uione_1.storage.resource();
    if (status === Status.Success) {
      this.showMessage(r.value('msg_reject_success'));
    }
    else if (status === Status.VersionError) {
      var msg = uione_2.message(uione_1.storage.resource(), 'msg_approve_version_error', 'error');
      this.alertError(msg.message, msg.title);
    }
    else if (status === Status.NotFound) {
      this.handleNotFound();
    }
    else {
      this.handleError(err);
    }
  };
  BaseDiffApprComponent.prototype.showMessage = function (msg) {
    uione_1.storage.toast().showToast(msg);
  };
  BaseDiffApprComponent.prototype.alertError = function (msg, title) {
    uione_1.storage.alert().alertError(msg, title);
  };
  BaseDiffApprComponent.prototype.format = function () {
    var p = this.props;
    var diffModel = p['diffModel'];
    if (diffModel) {
      var differentKeys_1 = reflectx_1.diff(diffModel.origin, diffModel.value);
      var dataFields = form_util_1.getDataFields(this.form);
      dataFields.forEach(function (e) {
        if (differentKeys_1.indexOf(e.getAttribute('data-field')) >= 0) {
          if (e.childNodes.length === 3) {
            e.childNodes[1].classList.add('highlight');
            e.childNodes[2].classList.add('highlight');
          }
          else {
            e.classList.add('highlight');
          }
        }
      });
    }
    else {
      var _a = this.state, origin_1 = _a.origin, value = _a.value;
      var differentKeys_2 = reflectx_1.diff(origin_1, value);
      var dataFields = form_util_1.getDataFields(this.form);
      dataFields.forEach(function (e) {
        if (differentKeys_2.indexOf(e.getAttribute('data-field')) >= 0) {
          if (e.childNodes.length === 3) {
            e.childNodes[1].classList.add('highlight');
            e.childNodes[2].classList.add('highlight');
          }
          else {
            e.classList.add('highlight');
          }
        }
      });
    }
  };
  BaseDiffApprComponent.prototype.handleNotFound = function () {
    this.setState({ disabled: true });
    var msg = uione_2.message(uione_1.storage.resource(), 'error_not_found', 'error');
    this.alertError(msg.message, msg.title);
  };
  BaseDiffApprComponent.prototype.handleError = function (err) {
    var r = uione_1.storage.resource();
    var msg = r.value('error_internal');
    if (err) {
      if (err.status && !isNaN(err.status)) {
        msg = uione_1.messageByHttpStatus(err.status, r);
      }
    }
    var title = r.value('error');
    this.alertError(msg, title);
  };
  return BaseDiffApprComponent;
}(React.Component));
exports.BaseDiffApprComponent = BaseDiffApprComponent;
function formatDiffModel(obj, formatFields) {
  if (!obj) {
    return obj;
  }
  var obj2 = reflectx_1.clone(obj);
  if (!obj2.origin) {
    obj2.origin = {};
  }
  else {
    if (typeof obj2.origin === 'string') {
      obj2.origin = JSON.parse(obj2.origin);
    }
    if (formatFields && typeof obj2.origin === 'object' && !Array.isArray(obj2.origin)) {
      obj2.origin = formatFields(obj2.origin);
    }
  }
  if (!obj2.value) {
    obj2.value = {};
  }
  else {
    if (typeof obj2.value === 'string') {
      obj2.value = JSON.parse(obj2.value);
    }
    if (formatFields && typeof obj2.value === 'object' && !Array.isArray(obj2.value)) {
      obj2.value = formatFields(obj2.value);
    }
  }
  return obj2;
}
exports.formatDiffModel = formatDiffModel;
var DiffApprComponent = (function (_super) {
  __extends(DiffApprComponent, _super);
  function DiffApprComponent(props, metadata, service) {
    var _this = _super.call(this, props, metadata) || this;
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
    var id = core_1.buildId(this.keys, this.props);
    this.load(id);
  };
  DiffApprComponent.prototype.formatFields = function (value) {
    return value;
  };
  DiffApprComponent.prototype.load = function (_id) {
    return __awaiter(this, void 0, void 0, function () {
      var id, dobj, formatdDiff, err_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            id = _id;
            if (!(id != null && id !== '')) return [3, 5];
            this.id = _id;
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, 4, 5]);
            return [4, this.service.diff(id)];
          case 2:
            dobj = _a.sent();
            if (!dobj) {
              this.handleNotFound();
            }
            else {
              formatdDiff = formatDiffModel(dobj, this.formatFields);
              this.setState({
                origin: formatdDiff.origin,
                value: formatdDiff.value
              }, this.format);
            }
            return [3, 5];
          case 3:
            err_1 = _a.sent();
            if (err_1 && err_1.status === 404) {
              this.handleNotFound();
            }
            else {
              this.handleError(err_1);
            }
            this.handleError(err_1);
            return [3, 5];
          case 4:
            this.running = false;
            uione_1.storage.loading().hideLoading();
            return [7];
          case 5: return [2];
        }
      });
    });
  };
  DiffApprComponent.prototype.approve = function (event) {
    return __awaiter(this, void 0, void 0, function () {
      var id, status_1, err_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            event.preventDefault();
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            id = this.id;
            return [4, this.service.approve(id)];
          case 2:
            status_1 = _a.sent();
            this.postApprove(status_1, null);
            return [3, 4];
          case 3:
            err_2 = _a.sent();
            this.postApprove(Status.Error, err_2);
            return [3, 4];
          case 4: return [2];
        }
      });
    });
  };
  DiffApprComponent.prototype.reject = function (event) {
    return __awaiter(this, void 0, void 0, function () {
      var id, status_2, err_3;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            event.preventDefault();
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            id = this.id;
            return [4, this.service.reject(id)];
          case 2:
            status_2 = _a.sent();
            this.postReject(status_2, null);
            return [3, 4];
          case 3:
            err_3 = _a.sent();
            this.postReject(Status.Error, err_3);
            return [3, 4];
          case 4: return [2];
        }
      });
    });
  };
  return DiffApprComponent;
}(BaseDiffApprComponent));
exports.DiffApprComponent = DiffApprComponent;
