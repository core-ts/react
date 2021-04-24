"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var formutil_1 = require("./formutil");
function createEditStatus(status) {
  if (status) {
    return status;
  }
  var s = {
    DuplicateKey: 0,
    NotFound: 0,
    Success: 1,
    VersionError: 2,
    Error: 4,
    DataCorrupt: 8
  };
  return s;
}
exports.createEditStatus = createEditStatus;
function createDiffStatus(status) {
  if (status) {
    return status;
  }
  var s = {
    NotFound: 0,
    Success: 1,
    VersionError: 2,
    Error: 4
  };
  return s;
}
exports.createDiffStatus = createDiffStatus;
var resource = (function () {
  function resource() {
  }
  resource.phone = / |\-|\.|\(|\)/g;
  resource._cache = {};
  resource.cache = true;
  return resource;
}());
exports.resource = resource;
function getCurrencyCode(form) {
  return (form ? form.getAttribute('currency-code') : null);
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
function message(gv, msg, title, yes, no) {
  var m2 = (msg && msg.length > 0 ? gv(msg) : '');
  var m = {
    message: m2
  };
  if (title && title.length > 0) {
    m.title = gv(title);
  }
  if (yes && yes.length > 0) {
    m.yes = gv(yes);
  }
  if (no && no.length > 0) {
    m.no = gv(no);
  }
  return m;
}
exports.message = message;
function messageByHttpStatus(status, gv) {
  var k = 'status_' + status;
  var msg = gv(k);
  if (!msg || msg.length === 0) {
    msg = gv('error_internal');
  }
  return msg;
}
exports.messageByHttpStatus = messageByHttpStatus;
function buildKeys(m) {
  var ks = Object.keys(m.attributes);
  var ps = [];
  for (var _i = 0, ks_1 = ks; _i < ks_1.length; _i++) {
    var k = ks_1[_i];
    var attr = m.attributes[k];
    if (attr.key === true) {
      ps.push(k);
    }
  }
  return ps;
}
exports.buildKeys = buildKeys;
function buildId(props, keys) {
  if (!props) {
    return null;
  }
  var sp = (props.match ? props : props['props']);
  if (!keys || keys.length === 0 || keys.length === 1) {
    if (keys && keys.length === 1) {
      var x = sp.match.params[keys[0]];
      if (x && x !== '') {
        return x;
      }
    }
    return sp.match.params['id'];
  }
  var id = {};
  for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
    var key = keys_1[_i];
    var v = sp.match.params[key];
    if (!v) {
      v = sp[key];
      if (!v) {
        return null;
      }
    }
    id[key] = v;
  }
  return id;
}
exports.buildId = buildId;
function dateToDefaultString(date) {
  return '' + date.getFullYear() + '-' + addZero(date.getMonth() + 1, 2) + '-' + addZero(date.getDate(), 2);
}
exports.dateToDefaultString = dateToDefaultString;
function addZero(val, num) {
  var v = val.toString();
  while (v.length < num) {
    v = '0' + v;
  }
  return v.toString();
}
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
function getModelName(form) {
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
  return '';
}
exports.getModelName = getModelName;
