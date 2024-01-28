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
var react_router_1 = require("react-router");
var core_1 = require("./core");
var edit_1 = require("./edit");
var formutil_1 = require("./formutil");
var merge_1 = require("./merge");
var reflect_1 = require("./reflect");
var state_1 = require("./state");
var update_1 = require("./update");
exports.useEdit = function (refForm, initialState, service, p2, p) {
  var params = react_router_1.useParams();
  var baseProps = exports.useCoreEdit(refForm, initialState, service, p2, p);
  react_1.useEffect(function () {
    if (refForm) {
      var registerEvents = (p2.ui ? p2.ui.registerEvents : undefined);
      core_1.initForm(baseProps.refForm.current, registerEvents);
    }
    var n = baseProps.getModelName(refForm.current);
    var obj = {};
    obj[n] = baseProps.createModel();
    baseProps.setState(obj);
    var keys;
    if (p && !p.keys && service && service.metadata) {
      var metadata = (p.metadata ? p.metadata : service.metadata());
      if (metadata) {
        var meta = edit_1.build(metadata);
        keys = (p.keys ? p.keys : (meta ? meta.keys : undefined));
        var version = (p.version ? p.version : (meta ? meta.version : undefined));
        p.keys = keys;
        p.version = version;
      }
    }
    var id = core_1.buildId(params, keys);
    if (p && p.initialize) {
      p.initialize(id, baseProps.load, baseProps.setState, p.callback);
    }
    else {
      try {
        baseProps.load(id, p ? p.callback : undefined);
      }
      catch (error) {
        p2.showError(error);
        core_1.hideLoading(p2.loading);
      }
    }
  }, []);
  return __assign({}, baseProps);
};
exports.useEditProps = function (props, refForm, initialState, service, p2, p) {
  var params = react_router_1.useParams();
  var baseProps = exports.useCoreEdit(refForm, initialState, service, p2, p, props);
  react_1.useEffect(function () {
    if (refForm) {
      var registerEvents = (p2.ui ? p2.ui.registerEvents : undefined);
      core_1.initForm(baseProps.refForm.current, registerEvents);
    }
    var n = baseProps.getModelName(refForm.current);
    var obj = {};
    obj[n] = baseProps.createModel();
    baseProps.setState(obj);
    var keys;
    if (p && !p.keys && service && service.metadata) {
      var metadata = (p.metadata ? p.metadata : service.metadata());
      if (metadata) {
        var meta = edit_1.build(metadata);
        keys = (p.keys ? p.keys : (meta ? meta.keys : undefined));
        var version = (p.version ? p.version : (meta ? meta.version : undefined));
        p.keys = keys;
        p.version = version;
      }
    }
    var id = core_1.buildId(params, keys);
    if (p && p.initialize) {
      p.initialize(id, baseProps.load, baseProps.setState, p.callback);
    }
    else {
      baseProps.load(id, p ? p.callback : undefined);
    }
  }, []);
  return __assign({}, baseProps);
};
exports.useEditOneProps = function (p) {
  return exports.useEditProps(p.props, p.refForm, p.initialState, p.service, p, p);
};
exports.useEditOne = function (p) {
  return exports.useEdit(p.refForm, p.initialState, p.service, p, p);
};
exports.useCoreEdit = function (refForm, initialState, service, p1, p, props) {
  var navigate = react_router_1.useNavigate();
  var _a = react_1.useState(), running = _a[0], setRunning = _a[1];
  var getModelName = function (f) {
    if (p && p.name && p.name.length > 0) {
      return p.name;
    }
    return core_1.getModelName(f);
  };
  var baseProps = update_1.useUpdate(initialState, getModelName, p1.getLocale);
  var state = baseProps.state, setState = baseProps.setState;
  var _b = merge_1.useMergeState({
    newMode: false,
    setBack: false,
    readOnly: p ? p.readOnly : undefined,
    originalModel: undefined
  }), flag = _b[0], setFlag = _b[1];
  var showModel = function (model) {
    var n = getModelName(refForm.current);
    var objSet = {};
    objSet[n] = model;
    setState(objSet);
    if (p && p.readOnly) {
      var f = refForm.current;
      formutil_1.setReadOnly(f);
    }
  };
  var resetState = function (newMode, model, originalModel) {
    setFlag({ newMode: newMode, originalModel: originalModel });
    showModel(model);
  };
  var _handleNotFound = function (form) {
    var msg = core_1.message(p1.resource.value, 'error_404', 'error');
    if (form) {
      formutil_1.setReadOnly(form);
    }
    p1.showError(msg.message, msg.title, undefined, function () { return window.history.back; });
  };
  var handleNotFound = (p && p.handleNotFound ? p.handleNotFound : _handleNotFound);
  var _getModel = function () {
    var n = getModelName(refForm.current);
    if (props) {
      return props[n] || state[n];
    }
    else {
      return state[n];
    }
  };
  var getModel = (p && p.getModel ? p.getModel : _getModel);
  var back = function (event) {
    if (event) {
      event.preventDefault();
    }
    var obj = getModel();
    var metadata = (p && p.metadata ? p.metadata : (service.metadata ? service.metadata() : undefined));
    var keys;
    var version;
    if (p && metadata && (!p.keys || !p.version)) {
      var meta = edit_1.build(metadata);
      keys = (p.keys ? p.keys : (meta ? meta.keys : undefined));
      version = (p.version ? p.version : (meta ? meta.version : undefined));
    }
    var diffObj = reflect_1.makeDiff(edit_1.initPropertyNullInModel(flag.originalModel, metadata), obj, keys, version);
    var objKeys = Object.keys(diffObj);
    if (objKeys.length === 0) {
      navigate(-1);
    }
    else {
      var msg = core_1.message(p1.resource.value, 'msg_confirm_back', 'confirm', 'yes', 'no');
      p1.confirm(msg.message, msg.title, function () {
        navigate(-1);
      }, msg.no, msg.yes);
    }
  };
  var _createModel = function () {
    var metadata = (p && p.metadata ? p.metadata : (service.metadata ? service.metadata() : undefined));
    if (metadata) {
      var obj = edit_1.createModel(metadata);
      return obj;
    }
    else {
      var obj = {};
      return obj;
    }
  };
  var createModel = (p && p.createModel ? p.createModel : _createModel);
  var create = function (event) {
    event.preventDefault();
    var obj = createModel();
    resetState(true, obj, undefined);
    var u = p1.ui;
    if (u) {
      setTimeout(function () {
        u.removeFormError(refForm.current);
      }, 100);
    }
  };
  var _onSave = function (isBack) {
    if (flag.newMode === true) {
      var m = core_1.message(p1.resource.value, 'error_permission_add', 'error_permission');
      p1.showError(m.message, m.title);
      return;
    }
    else if (p && flag.newMode === false && p.readOnly) {
      var msg = core_1.message(p1.resource.value, 'error_permission_edit', 'error_permission');
      p1.showError(msg.message, msg.title);
      return;
    }
    else {
      if (running === true) {
        return;
      }
      var obj_1 = getModel();
      var metadata = (p && p.metadata ? p.metadata : (service.metadata ? service.metadata() : undefined));
      var keys = void 0;
      var version_1;
      if (p && metadata && (!p.keys || !p.version)) {
        var meta = edit_1.build(metadata);
        keys = (p.keys ? p.keys : (meta ? meta.keys : undefined));
        version_1 = (p.version ? p.version : (meta ? meta.version : undefined));
      }
      if (flag.newMode) {
        validate(obj_1, function () {
          var msg = core_1.message(p1.resource.value, 'msg_confirm_save', 'confirm', 'yes', 'no');
          p1.confirm(msg.message, msg.title, function () {
            doSave(obj_1, undefined, version_1, isBack);
          }, msg.no, msg.yes);
        });
      }
      else {
        var diffObj_1 = reflect_1.makeDiff(edit_1.initPropertyNullInModel(flag.originalModel, metadata), obj_1, keys, version_1);
        var objKeys = Object.keys(diffObj_1);
        if (objKeys.length === 0) {
          p1.showMessage(p1.resource.value('msg_no_change'));
        }
        else {
          validate(obj_1, function () {
            var msg = core_1.message(p1.resource.value, 'msg_confirm_save', 'confirm', 'yes', 'no');
            p1.confirm(msg.message, msg.title, function () {
              doSave(obj_1, diffObj_1, version_1, isBack);
            }, msg.no, msg.yes);
          });
        }
      }
    }
  };
  var onSave = (p && p.onSave ? p.onSave : _onSave);
  var save = function (event) {
    event.preventDefault();
    event.persist();
    onSave();
  };
  var _validate = function (obj, callback) {
    if (p1.ui) {
      var valid = p1.ui.validateForm(refForm.current, state_1.localeOf(undefined, p1.getLocale));
      if (valid) {
        callback(obj);
      }
    }
    else {
      callback(obj);
    }
  };
  var validate = (p && p.validate ? p.validate : _validate);
  var _succeed = function (msg, origin, version, isBack, model) {
    if (model) {
      setFlag({ newMode: false });
      if (model && flag.setBack === true) {
        resetState(false, model, reflect_1.clone(model));
      }
      else {
        edit_1.handleVersion(origin, version);
      }
    }
    else {
      edit_1.handleVersion(origin, version);
    }
    p1.showMessage(msg);
    if (isBack) {
      back(undefined);
    }
  };
  var succeed = (p && p.succeed ? p.succeed : _succeed);
  var _fail = function (result) {
    var f = refForm.current;
    var u = p1.ui;
    if (u && f) {
      var unmappedErrors = u.showFormError(f, result);
      formutil_1.focusFirstError(f);
      if (unmappedErrors && unmappedErrors.length > 0) {
        var t = p1.resource.value('error');
        if (p1.ui && p1.ui.buildErrorMessage) {
          var msg = p1.ui.buildErrorMessage(unmappedErrors);
          p1.showError(msg, t);
        }
        else {
          p1.showError(unmappedErrors[0].field + ' ' + unmappedErrors[0].code + ' ' + unmappedErrors[0].message, t);
        }
      }
    }
    else {
      var t = p1.resource.value('error');
      if (result.length > 0) {
        p1.showError(result[0].field + ' ' + result[0].code + ' ' + result[0].message, t);
      }
      else {
        p1.showError(t, t);
      }
    }
  };
  var fail = (p && p.fail ? p.fail : _fail);
  var _handleError = function (err) {
    if (err) {
      setRunning(false);
      core_1.hideLoading(p1.loading);
      var errMsg = p1.resource.value('error_internal');
      var data = (err && err.response) ? err.response : err;
      if (data.status === 400) {
        var errMsg_1 = p1.resource.value('error_400');
        p1.showError(errMsg_1, "Error");
      }
      else {
        p1.showError(errMsg, "Error");
      }
    }
  };
  var handleError = (p && p.handleError ? p.handleError : _handleError);
  var _postSave = function (r, origin, version, isPatch, backOnSave) {
    setRunning(false);
    core_1.hideLoading(p1.loading);
    var x = r;
    var successMsg = p1.resource.value('msg_save_success');
    var newMod = flag.newMode;
    if (Array.isArray(x)) {
      fail(x);
    }
    else if (!isNaN(x)) {
      if (x > 0) {
        succeed(successMsg, origin, version, backOnSave);
      }
      else {
        if (newMod && x <= 0) {
          handleDuplicateKey();
        }
        else if (!newMod && x === 0) {
          handleNotFound();
        }
        else {
          var title = p1.resource.value('error');
          var err = p1.resource.value('error_version');
          p1.showError(err, title);
        }
      }
    }
    else {
      var result = r;
      if (isPatch) {
        var keys = Object.keys(result);
        var a = origin;
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
          var k = keys_1[_i];
          a[k] = result[k];
        }
        succeed(successMsg, a, undefined, backOnSave, a);
      }
      else {
        succeed(successMsg, origin, version, backOnSave, r);
      }
      p1.showMessage(successMsg);
    }
  };
  var postSave = (p && p.postSave ? p.postSave : _postSave);
  var _handleDuplicateKey = function (result) {
    var msg = core_1.message(p1.resource.value, 'error_duplicate_key', 'error');
    p1.showError(msg.message, msg.title);
  };
  var handleDuplicateKey = (p && p.handleDuplicateKey ? p.handleDuplicateKey : _handleDuplicateKey);
  var _doSave = function (obj, body, version, isBack) {
    setRunning(true);
    core_1.showLoading(p1.loading);
    var isBackO = (isBack != null && isBack !== undefined ? isBack : false);
    var patchable = (p ? p.patchable : true);
    if (flag.newMode === false) {
      if (service.patch && patchable !== false && body && Object.keys(body).length > 0) {
        service.patch(body).then(function (result) {
          postSave(result, obj, version, true, isBackO);
        }).catch(handleError);
      }
      else {
        service.update(obj).then(function (result) { return postSave(result, obj, version, false, isBackO); }).catch(handleError);
      }
    }
    else {
      service.insert(obj).then(function (result) { return postSave(result, obj, version, false, isBackO); }).catch(handleError);
    }
  };
  var doSave = (p && p.doSave ? p.doSave : _doSave);
  var _load = function (_id, callback) {
    var id = _id;
    if (id != null && id !== '') {
      setRunning(true);
      core_1.showLoading(p1.loading);
      service.load(id).then(function (obj) {
        if (!obj) {
          handleNotFound(refForm.current);
        }
        else {
          setFlag({ newMode: false, originalModel: reflect_1.clone(obj) });
          if (callback) {
            callback(obj, showModel);
          }
          else {
            showModel(obj);
          }
        }
        setRunning(false);
        core_1.hideLoading(p1.loading);
      }).catch(function (err) {
        var _a, _b, _c;
        var data = (err && err.response) ? err.response : err;
        var r = p1.resource;
        var title = r.value('error');
        var msg = r.value('error_internal');
        if (data && data.status === 422) {
          fail((_a = err.response) === null || _a === void 0 ? void 0 : _a.data);
          var obj = (_c = (_b = err.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.value;
          if (obj) {
            callback ? callback(obj, showModel) : showModel(obj);
          }
        }
        else {
          if (data && data.status === 404) {
            handleNotFound(refForm.current);
          }
          else {
            if (data.status && !isNaN(data.status)) {
              msg = core_1.messageByHttpStatus(data.status, r.value);
            }
            if (data && (data.status === 401 || data.status === 403)) {
              formutil_1.setReadOnly(refForm.current);
            }
            p1.showError(msg, title);
          }
        }
        setRunning(false);
        core_1.hideLoading(p1.loading);
      });
    }
    else {
      var obj = createModel();
      setFlag({ newMode: true, originalModel: undefined });
      if (callback) {
        callback(obj, showModel);
      }
      else {
        showModel(obj);
      }
    }
  };
  var load = (p && p.load ? p.load : _load);
  return __assign(__assign({}, baseProps), {
    back: back,
    refForm: refForm, ui: p1.ui, resource: p1.resource.resource(), flag: flag,
    running: running,
    setRunning: setRunning,
    showModel: showModel,
    getModelName: getModelName,
    resetState: resetState,
    handleNotFound: handleNotFound,
    getModel: getModel,
    createModel: createModel,
    create: create,
    save: save,
    onSave: onSave,
    confirm: confirm,
    validate: validate, showMessage: p1.showMessage, succeed: succeed,
    fail: fail,
    postSave: postSave,
    handleDuplicateKey: handleDuplicateKey,
    load: load,
    doSave: doSave
  });
};
