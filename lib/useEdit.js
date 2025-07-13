"use strict"
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i]
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
        }
        return t
      }
    return __assign.apply(this, arguments)
  }
Object.defineProperty(exports, "__esModule", { value: true })
var react_1 = require("react")
var react_router_1 = require("react-router")
var core_1 = require("./core")
var edit_1 = require("./edit")
var error_1 = require("./error")
var formutil_1 = require("./formutil")
var input_1 = require("./input")
var merge_1 = require("./merge")
var reflect_1 = require("./reflect")
var state_1 = require("./state")
var update_1 = require("./update")
function buildKeys(attributes) {
  if (!attributes) {
    return []
  }
  var ks = Object.keys(attributes)
  var ps = []
  for (var _i = 0, ks_1 = ks; _i < ks_1.length; _i++) {
    var k = ks_1[_i]
    var attr = attributes[k]
    if (attr.key === true) {
      ps.push(k)
    }
  }
  return ps
}
exports.buildKeys = buildKeys
function buildId(p, keys) {
  if (!keys || keys.length === 0 || keys.length === 1) {
    if (keys && keys.length === 1) {
      if (p[keys[0]]) {
        return p[keys[0]]
      }
    }
    return p["id"]
  }
  var id = {}
  for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
    var key = keys_1[_i]
    var v = p[key]
    if (!v) {
      v = p[key]
      if (!v) {
        return null
      }
    }
    id[key] = v
  }
  return id
}
exports.buildId = buildId
function build(attributes, name) {
  if (!attributes) {
    return undefined
  }
  if (core_1.resources.cache && name && name.length > 0) {
    var meta = core_1.resources._cache[name]
    if (!meta) {
      meta = buildMetaModel(attributes)
      core_1.resources._cache[name] = meta
    }
    return meta
  } else {
    return buildMetaModel(attributes)
  }
}
exports.build = build
function buildMetaModel(attributes) {
  if (!attributes) {
    return {}
  }
  var md = {}
  var pks = new Array()
  var keys = Object.keys(attributes)
  for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
    var key = keys_2[_i]
    var attr = attributes[key]
    if (attr) {
      if (attr.version) {
        md.version = key
      }
      if (attr.key === true) {
        pks.push(key)
      }
    }
  }
  md.keys = pks
  return md
}
function handleVersion(obj, version) {
  if (obj && version && version.length > 0) {
    var v = obj[version]
    if (v && typeof v === "number") {
      obj[version] = v + 1
    } else {
      obj[version] = 1
    }
  }
}
exports.handleVersion = handleVersion
exports.useEdit = function (refForm, initialState, service, p2, p) {
  var params = react_router_1.useParams()
  var baseProps = exports.useCoreEdit(refForm, initialState, service, p2, p)
  react_1.useEffect(function () {
    if (refForm) {
      var registerEvents = p2.ui ? p2.ui.registerEvents : undefined
      input_1.initForm(baseProps.refForm.current, registerEvents)
    }
    var n = baseProps.getModelName(refForm.current)
    var obj = {}
    obj[n] = baseProps.createModel()
    baseProps.setState(obj)
    var keys
    if (p && !p.keys && service && service.metadata) {
      var metadata = p.metadata ? p.metadata : service.metadata()
      if (metadata) {
        var meta = build(metadata)
        keys = p.keys ? p.keys : meta ? meta.keys : undefined
        var version = p.version ? p.version : meta ? meta.version : undefined
        p.keys = keys
        p.version = version
      }
    }
    var id = buildId(params, keys)
    if (p && p.initialize) {
      p.initialize(id, baseProps.load, baseProps.setState, p.callback)
    } else {
      try {
        baseProps.load(id, p ? p.callback : undefined)
      } catch (error) {
        p2.showError(error)
        input_1.hideLoading(p2.loading)
      }
    }
  }, [])
  return __assign({}, baseProps)
}
exports.useEditProps = function (props, refForm, initialState, service, p2, p) {
  var params = react_router_1.useParams()
  var baseProps = exports.useCoreEdit(refForm, initialState, service, p2, p, props)
  react_1.useEffect(function () {
    if (refForm) {
      var registerEvents = p2.ui ? p2.ui.registerEvents : undefined
      input_1.initForm(baseProps.refForm.current, registerEvents)
    }
    var n = baseProps.getModelName(refForm.current)
    var obj = {}
    obj[n] = baseProps.createModel()
    baseProps.setState(obj)
    var keys
    if (p && !p.keys && service && service.metadata) {
      var metadata = p.metadata ? p.metadata : service.metadata()
      if (metadata) {
        var meta = build(metadata)
        keys = p.keys ? p.keys : meta ? meta.keys : undefined
        var version = p.version ? p.version : meta ? meta.version : undefined
        p.keys = keys
        p.version = version
      }
    }
    var id = buildId(params, keys)
    if (p && p.initialize) {
      p.initialize(id, baseProps.load, baseProps.setState, p.callback)
    } else {
      baseProps.load(id, p ? p.callback : undefined)
    }
  }, [])
  return __assign({}, baseProps)
}
exports.useEditOneProps = function (p) {
  return exports.useEditProps(p.props, p.refForm, p.initialState, p.service, p, p)
}
exports.useEditOne = function (p) {
  return exports.useEdit(p.refForm, p.initialState, p.service, p, p)
}
exports.useCoreEdit = function (refForm, initialState, service, p1, p, props) {
  var navigate = react_router_1.useNavigate()
  var _a = react_1.useState(),
    running = _a[0],
    setRunning = _a[1]
  var getModelName = function (f) {
    if (p && p.name && p.name.length > 0) {
      return p.name
    }
    return update_1.getModelName(f)
  }
  var baseProps = update_1.useUpdate(initialState, getModelName, p1.getLocale)
  var state = baseProps.state,
    setState = baseProps.setState
  var _b = merge_1.useMergeState({
      newMode: false,
      setBack: false,
      readOnly: p ? p.readOnly : undefined,
      originalModel: undefined,
    }),
    flag = _b[0],
    setFlag = _b[1]
  var showModel = function (model) {
    var n = getModelName(refForm.current)
    var objSet = {}
    objSet[n] = model
    setState(objSet)
    if (p && p.readOnly) {
      var f = refForm.current
      formutil_1.setReadOnly(f)
    }
  }
  var resetState = function (newMode, model, originalModel) {
    setFlag({ newMode: newMode, originalModel: originalModel })
    showModel(model)
  }
  var _handleNotFound = function (form) {
    if (form) {
      formutil_1.setReadOnly(form)
    }
    var resource = p1.resource.resource()
    p1.showError(
      resource.error_404,
      function () {
        return window.history.back
      },
      resource.error,
    )
  }
  var handleNotFound = p && p.handleNotFound ? p.handleNotFound : _handleNotFound
  var _getModel = function () {
    var n = getModelName(refForm.current)
    if (props) {
      return props[n] || state[n]
    } else {
      return state[n]
    }
  }
  var getModel = p && p.getModel ? p.getModel : _getModel
  var back = function (event) {
    if (event) {
      event.preventDefault()
    }
    if (flag.newMode === true) {
      navigate(-1)
    } else {
      var obj = getModel()
      var diffObj = reflect_1.makeDiff(flag.originalModel, obj)
      var objKeys = Object.keys(diffObj)
      if (objKeys.length === 0) {
        navigate(-1)
      } else {
        var resource = p1.resource.resource()
        p1.confirm(
          resource.msg_confirm_back,
          function () {
            navigate(-1)
          },
          resource.confirm,
          resource.no,
          resource.yes,
        )
      }
    }
  }
  var _createModel = function () {
    var metadata = p && p.metadata ? p.metadata : service.metadata ? service.metadata() : undefined
    if (metadata) {
      var obj = edit_1.createModel(metadata)
      return obj
    } else {
      var obj = {}
      return obj
    }
  }
  var createModel = p && p.createModel ? p.createModel : _createModel
  var create = function (event) {
    event.preventDefault()
    var obj = createModel()
    resetState(true, obj, undefined)
    var u = p1.ui
    if (u) {
      setTimeout(function () {
        u.removeFormError(refForm.current)
      }, 100)
    }
  }
  var _onSave = function (isBack) {
    var resource = p1.resource.resource()
    if (p && p.readOnly) {
      if (flag.newMode === true) {
        p1.showError(resource.error_permission_add, undefined, resource.error_permission)
      } else {
        p1.showError(resource.error_permission_edit, undefined, resource.error_permission)
      }
    } else {
      if (running === true) {
        return
      }
      var obj_1 = getModel()
      var metadata = p && p.metadata ? p.metadata : service.metadata ? service.metadata() : undefined
      var keys = void 0
      var version_1
      if (p && metadata && (!p.keys || !p.version)) {
        var meta = build(metadata)
        keys = p.keys ? p.keys : meta ? meta.keys : undefined
        version_1 = p.version ? p.version : meta ? meta.version : undefined
      }
      if (flag.newMode) {
        validate(obj_1, function () {
          p1.confirm(
            resource.msg_confirm_save,
            function () {
              doSave(obj_1, undefined, version_1, isBack)
            },
            resource.confirm,
            resource.no,
            resource.yes,
          )
        })
      } else {
        var diffObj_1 = reflect_1.makeDiff(flag.originalModel, obj_1, keys, version_1)
        var objKeys = Object.keys(diffObj_1)
        if (objKeys.length === 0) {
          p1.showMessage(p1.resource.value("msg_no_change"))
        } else {
          validate(obj_1, function () {
            p1.confirm(
              resource.msg_confirm_save,
              function () {
                doSave(obj_1, diffObj_1, version_1, isBack)
              },
              resource.confirm,
              resource.no,
              resource.yes,
            )
          })
        }
      }
    }
  }
  var onSave = p && p.onSave ? p.onSave : _onSave
  var save = function (event) {
    event.preventDefault()
    event.persist()
    onSave()
  }
  var _validate = function (obj, callback) {
    if (p1.ui) {
      var valid = p1.ui.validateForm(refForm.current, state_1.localeOf(undefined, p1.getLocale))
      if (valid) {
        callback(obj)
      }
    } else {
      callback(obj)
    }
  }
  var validate = p && p.validate ? p.validate : _validate
  var _succeed = function (msg, origin, version, isBack, model) {
    if (model) {
      setFlag({ newMode: false })
      if (model && flag.setBack === true) {
        resetState(false, model, reflect_1.clone(model))
      } else {
        handleVersion(origin, version)
      }
    } else {
      handleVersion(origin, version)
    }
    p1.showMessage(msg)
    if (isBack) {
      back(undefined)
    }
  }
  var succeed = p && p.succeed ? p.succeed : _succeed
  var _fail = function (result) {
    var f = refForm.current
    var u = p1.ui
    if (u && f) {
      var unmappedErrors = u.showFormError(f, result)
      formutil_1.focusFirstError(f)
      if (unmappedErrors && unmappedErrors.length > 0) {
        var t = p1.resource.value("error")
        if (p1.ui && p1.ui.buildErrorMessage) {
          var msg = p1.ui.buildErrorMessage(unmappedErrors)
          p1.showError(msg, undefined, t)
        } else {
          p1.showError(unmappedErrors[0].field + " " + unmappedErrors[0].code + " " + unmappedErrors[0].message, undefined, t)
        }
      }
    } else {
      var t = p1.resource.value("error")
      if (result.length > 0) {
        p1.showError(result[0].field + " " + result[0].code + " " + result[0].message, undefined, t)
      } else {
        p1.showError(t, undefined, t)
      }
    }
  }
  var fail = p && p.fail ? p.fail : _fail
  var _handleError = function (err) {
    if (err) {
      setRunning(false)
      input_1.hideLoading(p1.loading)
      var errHeader = p1.resource.value("error")
      var errMsg = p1.resource.value("error_internal")
      var data = err && err.response ? err.response : err
      if (data.status === 400) {
        var errMsg_1 = p1.resource.value("error_400")
        p1.showError(errMsg_1, undefined, errHeader)
      } else {
        p1.showError(errMsg, undefined, errHeader)
      }
    }
  }
  var handleError = p && p.handleError ? p.handleError : _handleError
  var _postSave = function (r, origin, version, isPatch, backOnSave) {
    setRunning(false)
    input_1.hideLoading(p1.loading)
    var x = r
    var successMsg = p1.resource.value("msg_save_success")
    var newMod = flag.newMode
    if (Array.isArray(x)) {
      fail(x)
    } else if (!isNaN(x)) {
      if (x > 0) {
        succeed(successMsg, origin, version, backOnSave)
      } else {
        if (newMod && x <= 0) {
          handleDuplicateKey()
        } else if (!newMod && x === 0) {
          handleNotFound()
        } else {
          var title = p1.resource.value("error")
          var err = p1.resource.value("error_version")
          p1.showError(err, undefined, title)
        }
      }
    } else {
      var result = r
      if (isPatch) {
        var keys = Object.keys(result)
        var a = origin
        for (var _i = 0, keys_3 = keys; _i < keys_3.length; _i++) {
          var k = keys_3[_i]
          a[k] = result[k]
        }
        succeed(successMsg, a, undefined, backOnSave, a)
      } else {
        succeed(successMsg, origin, version, backOnSave, r)
      }
      p1.showMessage(successMsg)
    }
  }
  var postSave = p && p.postSave ? p.postSave : _postSave
  var _handleDuplicateKey = function (result) {
    var resource = p1.resource.resource()
    p1.showError(resource.error_duplicate_key, undefined, resource.error)
  }
  var handleDuplicateKey = p && p.handleDuplicateKey ? p.handleDuplicateKey : _handleDuplicateKey
  var _doSave = function (obj, body, version, isBack) {
    setRunning(true)
    input_1.showLoading(p1.loading)
    var isBackO = isBack != null && isBack !== undefined ? isBack : false
    var patchable = p ? p.patchable : true
    if (flag.newMode === false) {
      if (service.patch && patchable !== false && body && Object.keys(body).length > 0) {
        service
          .patch(body)
          .then(function (res) {
            postSave(res, obj, version, true, isBackO)
          })
          .catch(handleError)
      } else {
        service
          .update(obj)
          .then(function (res) {
            return postSave(res, obj, version, false, isBackO)
          })
          .catch(handleError)
      }
    } else {
      service
        .create(obj)
        .then(function (res) {
          return postSave(res, obj, version, false, isBackO)
        })
        .catch(handleError)
    }
  }
  var doSave = p && p.doSave ? p.doSave : _doSave
  var _load = function (_id, callback) {
    var id = _id
    if (id != null && id !== "") {
      setRunning(true)
      input_1.showLoading(p1.loading)
      service
        .load(id)
        .then(function (obj) {
          if (!obj) {
            handleNotFound(refForm.current)
          } else {
            setFlag({ newMode: false, originalModel: reflect_1.clone(obj) })
            if (callback) {
              callback(obj, showModel)
            } else {
              showModel(obj)
            }
          }
          setRunning(false)
          input_1.hideLoading(p1.loading)
        })
        .catch(function (err) {
          var _a, _b, _c
          var data = err && err.response ? err.response : err
          var resource = p1.resource.resource()
          var title = resource.error
          var msg = resource.error_internal
          if (data && data.status === 422) {
            fail((_a = err.response) === null || _a === void 0 ? void 0 : _a.data)
            var obj = (_c = (_b = err.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.value
            if (obj) {
              callback ? callback(obj, showModel) : showModel(obj)
            }
          } else {
            if (data && data.status === 404) {
              handleNotFound(refForm.current)
            } else {
              if (data.status && !isNaN(data.status)) {
                msg = error_1.messageByHttpStatus(data.status, resource)
              }
              if (data && (data.status === 401 || data.status === 403)) {
                formutil_1.setReadOnly(refForm.current)
              }
              p1.showError(msg, undefined, title)
            }
          }
          setRunning(false)
          input_1.hideLoading(p1.loading)
        })
    } else {
      var obj = createModel()
      setFlag({ newMode: true, originalModel: undefined })
      if (callback) {
        callback(obj, showModel)
      } else {
        showModel(obj)
      }
    }
  }
  var load = p && p.load ? p.load : _load
  return __assign(__assign({}, baseProps), {
    back: back,
    refForm: refForm,
    ui: p1.ui,
    resource: p1.resource.resource(),
    flag: flag,
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
    validate: validate,
    showMessage: p1.showMessage,
    succeed: succeed,
    fail: fail,
    postSave: postSave,
    handleDuplicateKey: handleDuplicateKey,
    load: load,
    doSave: doSave,
  })
}
