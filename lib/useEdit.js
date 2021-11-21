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
var reflectx_1 = require("reflectx");
var core_1 = require("./core");
var edit_1 = require("./edit");
var formutil_1 = require("./formutil");
var merge_1 = require("./merge");
var router_1 = require("./router");
var state_1 = require("./state");
var update_1 = require("./update");
function prepareData(data) {
}
exports.useEdit = function (refForm, initialState, service, p1, p2) {
  return exports.useCoreEdit(undefined, refForm, initialState, service, p1, p2);
};
exports.useEditProps = function (props, refForm, initialState, service, p2, p) {
  var baseProps = exports.useCoreEdit(props, refForm, initialState, service, p2, p);
  react_1.useEffect(function () {
    if (refForm) {
      var registerEvents = (p2.ui ? p2.ui.registerEvents : undefined);
      core_1.initForm(baseProps.refForm.current, registerEvents);
    }
    var n = baseProps.getModelName(refForm.current);
    var obj = {};
    obj[n] = baseProps.createNewModel();
    baseProps.setState(obj);
    var keys;
    if (p && !p.keys && service && service.metadata) {
      var metadata = (p.metadata ? p.metadata : service.metadata());
      var meta = edit_1.build(metadata);
      keys = (p.keys ? p.keys : (meta ? meta.keys : undefined));
      var version = (p.version ? p.version : (meta ? meta.version : undefined));
      p.keys = keys;
      p.version = version;
    }
    var id = core_1.buildId(props, keys);
    if (id) {
      if (p && p.initialize) {
        p.initialize(id, baseProps.load, baseProps.setState, p.callback);
      }
      else {
        baseProps.load(id, p ? p.callback : undefined);
      }
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
exports.useCoreEdit = function (props, refForm, initialState, service, p1, p) {
  var addable = (p && p.patchable !== false ? true : undefined);
  var goBack = router_1.useRouter().goBack;
  var back = function (event) {
    if (event) {
      event.preventDefault();
    }
    goBack();
  };
  var _a = react_1.useState(), running = _a[0], setRunning = _a[1];
  var getModelName = function (f) {
    if (p && p.name && p.name.length > 0) {
      return p.name;
    }
    return core_1.getModelName(f);
  };
  var baseProps = update_1.useUpdate(initialState, getModelName, p1.getLocale);
  var prepareCustomData = (p && p.prepareCustomData ? p.prepareCustomData : prepareData);
  var updateDateState = function (name, value) {
    var _a, _b, _c, _d, _e;
    var modelName = getModelName(refForm.current);
    var currentState = state[modelName];
    if (props && props.setGlobalState) {
      var data = props.shouldBeCustomized ? prepareCustomData((_a = {}, _a[name] = value, _a)) : (_b = {}, _b[name] = value, _b);
      props.setGlobalState((_c = {}, _c[modelName] = __assign(__assign({}, currentState), data), _c));
    }
    else {
      setState((_d = {}, _d[modelName] = __assign(__assign({}, currentState), (_e = {}, _e[name] = value, _e)), _d));
    }
  };
  var state = baseProps.state, setState = baseProps.setState;
  var _b = merge_1.useMergeState({
    newMode: false,
    setBack: false,
    addable: addable,
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
      formutil_1.readOnly(f);
    }
  };
  var resetState = function (newMode, model, originalModel) {
    setFlag({ newMode: newMode, originalModel: originalModel });
    showModel(model);
  };
  var _handleNotFound = function (form) {
    var msg = core_1.message(p1.resource.value, 'error_not_found', 'error');
    if (form) {
      formutil_1.readOnly(form);
    }
    p1.showError(msg.message, msg.title);
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
  var newOnClick = function (event) {
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
    if (flag.newMode === true && flag.addable === false) {
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
            save(obj_1, undefined, version_1, isBack);
          }, msg.no, msg.yes);
        });
      }
      else {
        var diffObj_1 = reflectx_1.makeDiff(edit_1.initPropertyNullInModel(flag.originalModel, metadata), obj_1, keys, version_1);
        var objKeys = Object.keys(diffObj_1);
        if (objKeys.length === 0) {
          p1.showMessage(p1.resource.value('msg_no_change'));
        }
        else {
          validate(obj_1, function () {
            var msg = core_1.message(p1.resource.value, 'msg_confirm_save', 'confirm', 'yes', 'no');
            p1.confirm(msg.message, msg.title, function () {
              save(obj_1, diffObj_1, version_1, isBack);
            }, msg.no, msg.yes);
          });
        }
      }
    }
  };
  var onSave = (p && p.onSave ? p.onSave : _onSave);
  var saveOnClick = function (event) {
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
  var _succeed = function (obj, msg, version, isBack, result) {
    if (result) {
      var model = result.value;
      setFlag({ newMode: false });
      if (model && flag.setBack === true) {
        resetState(false, model, reflectx_1.clone(model));
      }
      else {
        edit_1.handleVersion(obj, version);
      }
    }
    else {
      edit_1.handleVersion(obj, version);
    }
    p1.showMessage(msg);
    if (isBack) {
      back(undefined);
    }
  };
  var succeed = (p && p.succeed ? p.succeed : _succeed);
  var _fail = function (result) {
    var errors = result.errors;
    var f = refForm.current;
    var u = p1.ui;
    if (errors && u) {
      var unmappedErrors = u.showFormError(f, errors);
      formutil_1.focusFirstError(f);
      if (!result.message) {
        if (errors && errors.length === 1) {
          result.message = errors[0].message;
        }
        else {
          if (p1.ui && p1.ui.buildErrorMessage) {
            result.message = p1.ui.buildErrorMessage(unmappedErrors);
          }
          else {
            result.message = errors[0].message;
          }
        }
      }
      if (result.message) {
        var t = p1.resource.value('error');
        p1.showError(result.message, t);
      }
    }
  };
  var fail = (p && p.fail ? p.fail : _fail);
  var _postSave = function (obj, res, version, backOnSave) {
    setRunning(false);
    core_1.hideLoading(p1.loading);
    var x = res;
    var successMsg = p1.resource.value('msg_save_success');
    var newMod = flag.newMode;
    var st = core_1.createEditStatus(p ? p.status : undefined);
    if (!isNaN(x)) {
      if (x === st.success) {
        succeed(obj, successMsg, version, backOnSave);
      }
      else {
        if (newMod && x === st.duplicate_key) {
          handleDuplicateKey();
        }
        else if (!newMod && x === st.not_found) {
          handleNotFound();
        }
        else {
          edit_1.handleStatus(x, st, p1.resource.value, p1.showError);
        }
      }
    }
    else {
      var result = x;
      if (result.status === st.success) {
        succeed(obj, successMsg, version, backOnSave, result);
        p1.showMessage(successMsg);
      }
      else if (result.errors && result.errors.length > 0) {
        fail(result);
      }
      else if (newMod && result.status === st.duplicate_key) {
        handleDuplicateKey(result);
      }
      else if (!newMod && x === st.not_found) {
        handleNotFound();
      }
      else {
        edit_1.handleStatus(result.status, st, p1.resource.value, p1.showError);
      }
    }
  };
  var postSave = (p && p.postSave ? p.postSave : _postSave);
  var _handleDuplicateKey = function (result) {
    var msg = core_1.message(p1.resource.value, 'error_duplicate_key', 'error');
    p1.showError(msg.message, msg.title);
  };
  var handleDuplicateKey = (p && p.handleDuplicateKey ? p.handleDuplicateKey : _handleDuplicateKey);
  var _save = function (obj, body, version, isBack) {
    setRunning(true);
    core_1.showLoading(p1.loading);
    var isBackO = (isBack == null || isBack === undefined ? true : isBack);
    var patchable = (p ? p.patchable : true);
    if (flag.newMode === false) {
      if (service.patch && patchable !== false && body && Object.keys(body).length > 0) {
        service.patch(body).then(function (result) { return postSave(obj, result, version, isBackO); });
      }
      else {
        service.update(obj).then(function (result) { return postSave(obj, result, version, isBackO); });
      }
    }
    else {
      service.insert(obj).then(function (result) { return postSave(obj, result, version, isBackO); });
    }
  };
  var save = (p && p.save ? p.save : _save);
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
          setFlag({ newMode: false, originalModel: reflectx_1.clone(obj) });
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
        var data = (err && err.response) ? err.response : err;
        var r = p1.resource;
        var title = r.value('error');
        var msg = r.value('error_internal');
        if (data && data.status === 404) {
          handleNotFound(refForm.current);
        }
        else {
          if (data.status && !isNaN(data.status)) {
            msg = core_1.messageByHttpStatus(data.status, r.value);
          }
          if (data && (data.status === 401 || data.status === 403)) {
            formutil_1.readOnly(refForm.current);
          }
          p1.showError(msg, title);
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
    updateDateState: updateDateState,
    showModel: showModel,
    getModelName: getModelName,
    resetState: resetState,
    handleNotFound: handleNotFound,
    getModel: getModel, createNewModel: createModel, newOnClick: newOnClick,
    saveOnClick: saveOnClick,
    onSave: onSave,
    confirm: confirm,
    validate: validate, showMessage: p1.showMessage, succeed: succeed,
    fail: fail,
    postSave: postSave,
    handleDuplicateKey: handleDuplicateKey,
    load: load,
    save: save
  });
};
