"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var formutil_1 = require("./formutil");
exports.pageSizes = [12, 24, 60, 100, 120, 180, 300, 600];
exports.size = exports.pageSizes;
function createEditStatus(status) {
  if (status) {
    return status;
  }
  var s = {
    duplicate_key: 0,
    not_found: 0,
    success: 1,
    version_error: -1,
    error: 2,
    data_corrupt: 4
  };
  return s;
}
exports.createEditStatus = createEditStatus;
function createDiffStatus(status) {
  if (status) {
    return status;
  }
  var s = {
    not_found: 0,
    success: 1,
    version_error: 2,
    error: 4
  };
  return s;
}
exports.createDiffStatus = createDiffStatus;
var resource = (function () {
  function resource() {
  }
  resource.phone = / |-|\.|\(|\)/g;
  resource._cache = {};
  resource.cache = true;
  return resource;
}());
exports.resource = resource;
function getCurrencyCode(form) {
  if (form) {
    var x = form.getAttribute('currency-code');
    if (x) {
      return x;
    }
  }
  return undefined;
}
exports.getCurrencyCode = getCurrencyCode;
function removePhoneFormat(phone) {
  if (phone) {
    return phone.replace(resource.phone, '');
  }
  else {
    return phone;
  }
}
exports.removePhoneFormat = removePhoneFormat;
function getString(key, gv) {
  if (typeof gv === 'function') {
    return gv(key);
  }
  else {
    return gv[key];
  }
}
exports.getString = getString;
function message(gv, msg, title, yes, no) {
  var m2 = (msg && msg.length > 0 ? getString(msg, gv) : '');
  var m = { message: m2, title: '' };
  if (title && title.length > 0) {
    m.title = getString(title, gv);
  }
  if (yes && yes.length > 0) {
    m.yes = getString(yes, gv);
  }
  if (no && no.length > 0) {
    m.no = getString(no, gv);
  }
  return m;
}
exports.message = message;
function messageByHttpStatus(status, gv) {
  var k = 'status_' + status;
  var msg = getString(k, gv);
  if (!msg || msg.length === 0) {
    msg = getString('error_internal', gv);
  }
  return msg;
}
exports.messageByHttpStatus = messageByHttpStatus;
function buildKeys(attributes) {
  if (!attributes) {
    return [];
  }
  var ks = Object.keys(attributes);
  var ps = [];
  for (var _i = 0, ks_1 = ks; _i < ks_1.length; _i++) {
    var k = ks_1[_i];
    var attr = attributes[k];
    if (attr.key === true) {
      ps.push(k);
    }
  }
  return ps;
}
exports.buildKeys = buildKeys;
function buildId(p, keys) {
  if (!keys || keys.length === 0 || keys.length === 1) {
    if (keys && keys.length === 1) {
      if (p[keys[0]]) {
        return p[keys[0]];
      }
    }
    return p['id'];
  }
  var id = {};
  for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
    var key = keys_1[_i];
    var v = p[key];
    if (!v) {
      v = p[key];
      if (!v) {
        return null;
      }
    }
    id[key] = v;
  }
  return id;
}
exports.buildId = buildId;
exports.datetimeToString = function (inputDate) {
  var date = new Date(inputDate);
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, '0');
  var day = String(date.getDate()).padStart(2, '0');
  var hours = String(date.getHours()).padStart(2, '0');
  var minutes = String(date.getMinutes()).padStart(2, '0');
  var seconds = String(date.getSeconds()).padStart(2, '0');
  return year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;
};
exports.dateToString = function (inputDate) {
  var year = inputDate.getFullYear();
  var month = String(inputDate.getMonth() + 1).padStart(2, '0');
  var day = String(inputDate.getDate()).padStart(2, '0');
  return year + "-" + month + "-" + day;
};
function initForm(form, initMat) {
  if (form) {
    setTimeout(function () {
      if (initMat) {
        initMat(form);
      }
      formutil_1.focusFirstElement(form);
    }, 100);
  }
  return form;
}
exports.initForm = initForm;
function error(err, gv, ae) {
  var title = gv('error');
  var msg = gv('error_internal');
  if (!err) {
    ae(msg, title);
    return;
  }
  var data = err && err.response ? err.response : err;
  if (data) {
    var status_1 = data.status;
    if (status_1 && !isNaN(status_1)) {
      msg = messageByHttpStatus(status_1, gv);
    }
    ae(msg, title);
  }
  else {
    ae(msg, title);
  }
}
exports.error = error;
function getName(d, n) {
  return (n && n.length > 0 ? n : d);
}
exports.getName = getName;
function getModelName(form, name) {
  if (form) {
    var a = form.getAttribute('model-name');
    if (a && a.length > 0) {
      return a;
    }
    var b = form.name;
    if (b) {
      if (b.endsWith('Form')) {
        return b.substr(0, b.length - 4);
      }
      return b;
    }
  }
  if (name && name.length > 0) {
    return name;
  }
  return '';
}
exports.getModelName = getModelName;
exports.scrollToFocus = function (e, isUseTimeOut) {
  try {
    var element = e.target;
    var form = element.form;
    if (form) {
      var container_1 = form.childNodes[1];
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
  }
  catch (e) {
    console.log(e);
  }
};
function showLoading(s) {
  if (s) {
    s.showLoading();
  }
}
exports.showLoading = showLoading;
function hideLoading(s) {
  if (s) {
    s.hideLoading();
  }
}
exports.hideLoading = hideLoading;
function getRemoveError(u, rmErr) {
  if (rmErr) {
    return rmErr;
  }
  return (u && u.ui ? u.ui.removeError : undefined);
}
exports.getRemoveError = getRemoveError;
function removeFormError(u, f) {
  if (f && u && u.ui) {
    u.ui.removeFormError(f);
  }
}
exports.removeFormError = removeFormError;
function getValidateForm(u, vf) {
  if (vf) {
    return vf;
  }
  return (u && u.ui ? u.ui.validateForm : undefined);
}
exports.getValidateForm = getValidateForm;
function getDecodeFromForm(u, d) {
  if (d) {
    return d;
  }
  return (u && u.ui ? u.ui.decodeFromForm : undefined);
}
exports.getDecodeFromForm = getDecodeFromForm;
function handleToggle(target, on) {
  if (target) {
    if (on) {
      if (!target.classList.contains('on')) {
        target.classList.add('on');
      }
    }
    else {
      target.classList.remove('on');
    }
  }
}
exports.handleToggle = handleToggle;
