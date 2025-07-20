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
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length
    for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j]
    return r
  }
Object.defineProperty(exports, "__esModule", { value: true })
var react_1 = require("react")
var common_1 = require("./common")
var core_1 = require("./core")
var reflect_1 = require("./reflect")
var route_1 = require("./route")
var search_1 = require("./search")
var state_1 = require("./state")
var update_1 = require("./update")
function showPaging(com, list, pageSize, total) {
  com.total = total
  var pageTotal = search_1.getPageTotal(pageSize, total)
  com.pages = pageTotal
  com.showPaging = !total || com.pages <= 1 || (list && list.length >= total) ? false : true
}
exports.showPaging = showPaging
function removeFormError(u, f) {
  if (f && u && u.ui) {
    u.ui.removeFormError(f)
  }
}
exports.removeFormError = removeFormError
function getValidateForm(u, vf) {
  if (vf) {
    return vf
  }
  return u && u.ui ? u.ui.validateForm : undefined
}
exports.getValidateForm = getValidateForm
function getRemoveError(u, rmErr) {
  if (rmErr) {
    return rmErr
  }
  return u && u.ui ? u.ui.removeError : undefined
}
exports.getRemoveError = getRemoveError
function getModel(state, modelName, searchable, fields, excluding) {
  var obj2 = getModelFromState(state, modelName)
  var obj = obj2 ? obj2 : {}
  var obj3 = optimizeFilter(obj, searchable, fields)
  obj3.excluding = excluding
  return obj3
}
exports.getModel = getModel
function optimizeFilter(obj, searchable, fields) {
  obj.fields = fields
  if (searchable.page && searchable.page > 1) {
    obj.page = searchable.page
  } else {
    delete obj.page
  }
  obj.limit = searchable.limit
  if (searchable.appendMode && searchable.initLimit !== searchable.limit) {
    obj.firstLimit = searchable.initLimit
  } else {
    delete obj.firstLimit
  }
  if (searchable.sortField && searchable.sortField.length > 0) {
    obj.sort = searchable.sortType === "-" ? "-" + searchable.sortField : searchable.sortField
  } else {
    delete obj.sort
  }
  if (searchable) {
    mapObjects(obj, searchable)
  }
  return obj
}
exports.optimizeFilter = optimizeFilter
function mapObjects(dest, src) {
  var _a
  for (var key in dest) {
    if (src.hasOwnProperty(key) && src[key] !== null && src[key] !== undefined) {
      if (Array.isArray(dest[key]) && typeof src[key] === "string" && src[key].length > 0) {
        var arrayObjKeySrc = src[key].length > 0 ? ((_a = src[key]) === null || _a === void 0 ? void 0 : _a.split(",")) : []
        if (arrayObjKeySrc && arrayObjKeySrc.length > 1) {
          dest[key] = __spreadArrays(arrayObjKeySrc)
        } else {
          dest[key] = []
          dest[key].push(src[key])
        }
      } else {
        dest[key] = src[key]
      }
    }
  }
}
function getModelFromState(state, modelName) {
  if (!modelName || modelName.length === 0) {
    return state
  }
  if (!state) {
    return state
  }
  return state[modelName]
}
function getFieldsFromForm(fields, initFields, form) {
  if (fields && fields.length > 0) {
    return fields
  }
  if (!initFields) {
    if (form) {
      return search_1.getFields(form)
    }
  }
  return fields
}
exports.getFieldsFromForm = getFieldsFromForm
function append(list, results) {
  if (list && results) {
    for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
      var obj = results_1[_i]
      list.push(obj)
    }
  }
  if (!list) {
    return []
  }
  return list
}
exports.append = append
function handleAppend(com, list, limit, nextPageToken) {
  if (!limit || limit === 0) {
    com.appendable = false
  } else {
    if (!nextPageToken || nextPageToken.length === 0 || list.length < limit) {
      com.appendable = false
    } else {
      com.appendable = true
    }
  }
  if (!list || list.length === 0) {
    com.appendable = false
  }
}
exports.handleAppend = handleAppend
function formatResults(results, page, limit, initPageSize, sequenceNo, ft, lc) {
  if (results && results.length > 0) {
    var hasSequencePro = false
    if (ft) {
      if (sequenceNo && sequenceNo.length > 0) {
        for (var _i = 0, results_2 = results; _i < results_2.length; _i++) {
          var obj = results_2[_i]
          if (obj[sequenceNo]) {
            hasSequencePro = true
          }
          ft(obj, lc)
        }
      } else {
        for (var _a = 0, results_3 = results; _a < results_3.length; _a++) {
          var obj = results_3[_a]
          ft(obj, lc)
        }
      }
    } else if (sequenceNo && sequenceNo.length > 0) {
      for (var _b = 0, results_4 = results; _b < results_4.length; _b++) {
        var obj = results_4[_b]
        if (obj[sequenceNo]) {
          hasSequencePro = true
        }
      }
    }
    if (sequenceNo && sequenceNo.length > 0 && !hasSequencePro) {
      if (!page) {
        page = 1
      }
      if (limit) {
        if (!initPageSize) {
          initPageSize = limit
        }
        if (page <= 1) {
          for (var i = 0; i < results.length; i++) {
            results[i][sequenceNo] = i - limit + limit * page + 1
          }
        } else {
          for (var i = 0; i < results.length; i++) {
            results[i][sequenceNo] = i - limit + limit * page + 1 - (limit - initPageSize)
          }
        }
      } else {
        for (var i = 0; i < results.length; i++) {
          results[i][sequenceNo] = i + 1
        }
      }
    }
  }
}
exports.formatResults = formatResults
function validate(se, callback, form, lc, vf) {
  var valid = true
  if (form && vf) {
    valid = vf(form, lc)
  }
  if (valid === true) {
    callback()
  }
}
exports.validate = validate
exports.callSearch = function (se, search3, showResults3, searchError3, lc, nextPageToken) {
  var s = reflect_1.clone(se)
  var page = se.page
  if (!page || page < 1) {
    page = 1
  }
  if (!se.limit || se.limit <= 0) {
    se.limit = core_1.resources.defaultLimit
  }
  var limit = page <= 1 && se.firstLimit && se.firstLimit > 0 ? se.firstLimit : se.limit
  var next = nextPageToken && nextPageToken.length > 0 ? nextPageToken : page
  var fields = se.fields
  delete se["page"]
  delete se["fields"]
  delete se["firstLimit"]
  search3(s, limit, next, fields)
    .then(function (sr) {
      showResults3(s, sr, lc)
    })
    .catch(function (err) {
      return err && searchError3(err)
    })
}
var appendListOfState = function (results, list, setState2) {
  var arr = append(list, results)
  setState2({ list: arr })
}
var setListOfState = function (list, setState2) {
  setState2({ list: list })
}
function mergeParam(p) {
  if (p) {
    if (!p.sequenceNo) {
      p.sequenceNo = "sequenceNo"
    }
    if (!p.limit) {
      p.limit = 24
    }
    if (!p.pageSizes) {
      p.pageSizes = core_1.pageSizes
    }
    if (!p.pageMaxSize || p.pageMaxSize <= 0) {
      p.pageMaxSize = 7
    }
    if (p.hideFilter === undefined) {
      p.hideFilter = true
    }
    return p
  } else {
    return {
      sequenceNo: "sequenceNo",
      limit: 24,
      pageSizes: core_1.pageSizes,
      pageMaxSize: 7,
      hideFilter: true,
    }
  }
}
exports.mergeParam = mergeParam
exports.useSearch = function (refForm, initialState, service, resource, p2, p) {
  var baseProps = exports.useCoreSearch(refForm, initialState, service, resource, p2, p)
  react_1.useEffect(function () {
    var load = baseProps.load,
      setState = baseProps.setState,
      component = baseProps.component,
      searchError = baseProps.searchError
    if (refForm) {
      var registerEvents = p2.ui ? p2.ui.registerEvents : undefined
      common_1.initForm(refForm.current, registerEvents)
    }
    if (p && p.initialize) {
      p.initialize(load, setState, component)
    } else {
      var se = p && p.createFilter ? p.createFilter() : undefined
      try {
        var s = search_1.mergeFilter(route_1.buildFromUrl(se), se, component.pageSizes)
        load(s, p2.auto)
      } catch (error) {
        searchError(error)
      }
    }
  }, [])
  return __assign({}, baseProps)
}
exports.useSearchOneProps = function (resource, p) {
  return exports.useSearch(p.refForm, p.initialState, p.service, resource, p, p)
}
exports.useSearchOne = function (resource, p) {
  return exports.useCoreSearch(p.refForm, p.initialState, p.service, resource, p, p)
}
function getName(d, n) {
  return n && n.length > 0 ? n : d
}
exports.getName = getName
exports.useCoreSearch = function (refForm, initialState, service, resource, p1, p2) {
  var p = mergeParam(p2)
  var _a = react_1.useState(),
    running = _a[0],
    setRunning = _a[1]
  var _getModelName = function () {
    return getName("filter", p && p.name ? p.name : undefined)
  }
  var getModelName = p && p.getModelName ? p.getModelName : _getModelName
  var baseProps = update_1.useUpdate(initialState, getModelName, p1.getLocale, getRemoveError(p1))
  var state = baseProps.state,
    setState = baseProps.setState
  var _b = react_1.useState(false),
    rerender = _b[0],
    setRerender = _b[1]
  react_1.useEffect(
    function () {
      setRerender(!rerender)
    },
    [state],
  )
  var _getCurrencyCode = function () {
    return refForm && refForm.current ? refForm.current.getAttribute("currency-code") : "USD"
  }
  var getCurrencyCode = p && p.getCurrencyCode ? p.getCurrencyCode : _getCurrencyCode
  var _c = update_1.useMergeState(p),
    component = _c[0],
    setComponent = _c[1]
  var toggleFilter = function (event) {
    var hideFilter = search_1.handleToggle(event.target, component.hideFilter)
    setComponent({ hideFilter: hideFilter })
  }
  var _getFields = function () {
    var fields = component.fields,
      initFields = component.initFields
    var fs = getFieldsFromForm(fields, initFields, refForm.current)
    setComponent({ fields: fs, initFields: true })
    return fs
  }
  var getFields = p && p.getFields ? p.getFields : _getFields
  var _getFilter = function (se) {
    if (!se) {
      se = component
    }
    var keys = p && p.keys ? p.keys : undefined
    if (!keys && typeof service !== "function" && service.keys) {
      keys = service.keys()
    }
    var n = getModelName()
    var fs = p && p.fields
    if (!fs || fs.length <= 0) {
      fs = getFields()
    }
    var obj3 = getModel(state, n, se, fs, se.excluding)
    return obj3
  }
  var getFilter = p && p.getFilter ? p.getFilter : _getFilter
  var _setFilter = function (s) {
    var objSet = {}
    var n = getModelName()
    objSet[n] = s
    setState(objSet)
  }
  var setFilter = p && p.setFilter ? p.setFilter : _setFilter
  var _load = function (s, auto) {
    var com = Object.assign({}, component)
    var obj2 = search_1.initFilter(s, com)
    setComponent(com)
    setFilter(obj2)
    var runSearch = doSearch
    if (auto) {
      setTimeout(function () {
        runSearch(obj2, true)
      }, 0)
    }
  }
  var load = p && p.load ? p.load : _load
  var doSearch = function (se, isFirstLoad) {
    removeFormError(p1, refForm.current)
    var s = getFilter(se)
    if (isFirstLoad) {
      setState(state)
    }
    var isStillRunning = running
    validateSearch(s, function () {
      if (isStillRunning === true) {
        return
      }
      setRunning(true)
      common_1.showLoading(p1.loading)
      if (p && !p.ignoreUrlParam) {
        search_1.addParametersIntoUrl(s, isFirstLoad)
      }
      var lc = p1.getLocale ? p1.getLocale() : state_1.enLocale
      if (typeof service === "function") {
        exports.callSearch(s, service, showResults, searchError, lc, se.nextPageToken)
      } else {
        exports.callSearch(s, service.search, showResults, searchError, lc, se.nextPageToken)
      }
    })
  }
  var _validateSearch = function (se, callback) {
    validate(se, callback, refForm.current, p1.getLocale ? p1.getLocale() : undefined, getValidateForm(p1))
  }
  var validateSearch = p && p.validateSearch ? p.validateSearch : _validateSearch
  var pageSizeChanged = function (event) {
    var size = parseInt(event.currentTarget.value, 10)
    component.limit = size
    component.page = 1
    component.tmpPageIndex = 1
    setComponent({
      limit: size,
      page: 1,
      tmpPageIndex: 1,
    })
    doSearch(component)
  }
  var clearQ = function (e) {
    if (e) {
      e.preventDefault()
    }
    var n = getModelName()
    if (n && n.length > 0) {
      var m = state[n]
      if (m) {
        m.q = ""
        var setObj = {}
        setObj[n] = m
        setState(setObj)
        return
      }
    }
  }
  var search = function (event) {
    if (event) {
      event.preventDefault()
    }
    resetAndSearch()
  }
  var sort = function (event) {
    event.preventDefault()
    if (event && event.target) {
      var target = event.target
      var s = search_1.handleSort(target, component.sortTarget, component.sortField, component.sortType)
      setComponent({
        sortField: s.field,
        sortType: s.type,
        sortTarget: target,
      })
      component.sortField = s.field
      component.sortType = s.type
      component.sortTarget = target
    }
    if (!component.appendMode) {
      doSearch(component)
    } else {
      resetAndSearch()
    }
  }
  var changeView = function (event, view) {
    if (view && view.length > 0) {
      setComponent({ view: view })
    } else if (event && event.target) {
      var target = event.target
      var v = target.getAttribute("data-view")
      if (v && v.length > 0) {
        setComponent({ view: v })
      }
    }
  }
  var resetAndSearch = function () {
    if (running === true) {
      setComponent({ page: 1, triggerSearch: true })
      return
    }
    setComponent({ page: 1, tmpPageIndex: 1 })
    search_1.removeSortStatus(component.sortTarget)
    setComponent({
      sortTarget: undefined,
      sortField: undefined,
      append: false,
      page: 1,
    })
    component.sortTarget = undefined
    component.sortField = undefined
    component.append = false
    component.page = 1
    doSearch(component)
  }
  var searchError = function (err) {
    setComponent({ page: component.tmpPageIndex })
    common_1.error(err, resource, p1.showError)
    common_1.hideLoading(p1.loading)
  }
  var appendList = p && p.appendList ? p.appendList : appendListOfState
  var setList = p && p.setList ? p.setList : setListOfState
  var _showResults = function (s, sr, lc) {
    if (sr === undefined) {
      return
    }
    var results = (sr === null || sr === void 0 ? void 0 : sr.list) || []
    if (results && results.length > 0) {
      formatResults(results, component.page, component.limit, component.limit, p ? p.sequenceNo : undefined, p ? p.format : undefined, lc)
    }
    var am = component.appendMode
    var pi = s.page && s.page >= 1 ? s.page : 1
    setComponent({ total: sr.total, page: pi, nextPageToken: sr.next })
    if (am) {
      var limit = s.limit
      if ((!s.page || s.page <= 1) && s.firstLimit && s.firstLimit > 0) {
        limit = s.firstLimit
      }
      handleAppend(component, sr.list, limit, sr.next)
      if (component.append && s.page && s.page > 1) {
        appendList(results, component.list, setState)
      } else {
        setList(results, setState)
      }
    } else {
      showPaging(component, sr.list, s.limit, sr.total)
      setList(results, setState)
      setComponent({ tmpPageIndex: s.page })
      if (s.limit) {
        var m1 = search_1.buildMessage(resource, sr.list, s.limit, s.page, sr.total)
        p1.showMessage(m1)
      }
    }
    setRunning(false)
    common_1.hideLoading(p1.loading)
    if (component.triggerSearch) {
      setComponent({ triggerSearch: false })
      resetAndSearch()
    }
  }
  var showResults = p && p.showResults ? p.showResults : _showResults
  var showMore = function (event) {
    event.preventDefault()
    var n = component.page ? component.page + 1 : 2
    var m = component.page
    setComponent({ tmpPageIndex: m, page: n, append: true })
    component.tmpPageIndex = m
    component.page = n
    component.append = true
    doSearch(component)
  }
  var pageChanged = function (data) {
    var page = data.page,
      size = data.size
    setComponent({ page: page, limit: size, append: false })
    component.page = page
    component.limit = size
    component.append = false
    doSearch(component)
  }
  return __assign(__assign({}, baseProps), {
    running: running,
    setRunning: setRunning,
    getCurrencyCode: getCurrencyCode,
    setComponent: setComponent,
    component: component,
    showMessage: p1.showMessage,
    load: load,
    search: search,
    sort: sort,
    changeView: changeView,
    showMore: showMore,
    toggleFilter: toggleFilter,
    doSearch: doSearch,
    pageChanged: pageChanged,
    pageSizeChanged: pageSizeChanged,
    clearQ: clearQ,
    showResults: showResults,
    getFields: getFields,
    getModelName: getModelName,
    format: p ? p.format : undefined,
    searchError: searchError,
  })
}
