"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_util_1 = require("form-util");
var resource = (function (){
  function resource(){
  }
  resource.phone = / |\-|\.|\(|\)/g;
  resource._cache = {};
  resource.cache = true;
  return resource;
}());
exports.resource = resource;
function removePhoneFormat(phone){
  if (phone){
    return phone.replace(resource.phone, '');
  }
  else {
    return phone;
  }
}
exports.removePhoneFormat = removePhoneFormat;
function message(r, msg, title, yes, no){
  var m2 = (msg && msg.length > 0 ? r.value(msg) : '');
  var m = {
    message: m2
  };
  if (title && title.length > 0){
    m.title = r.value(title);
  }
  if (yes && yes.length > 0){
    m.yes = r.value(yes);
  }
  if (no && no.length > 0){
    m.no = r.value(no);
  }
  return m;
}
exports.message = message;
function messageByHttpStatus(status, r){
  var msg = r.value('error_internal');
  if (status === 401){
    msg = r.value('error_unauthorized');
  }
  else if (status === 403){
    msg = r.value('error_forbidden');
  }
  else if (status === 404){
    msg = r.value('error_not_found');
  }
  else if (status === 410){
    msg = r.value('error_gone');
  }
  else if (status === 503){
    msg = r.value('error_service_unavailable');
  }
  return msg;
}
exports.messageByHttpStatus = messageByHttpStatus;
var Type;
(function (Type){
  Type["ObjectId"] = "ObjectId";
  Type["Date"] = "date";
  Type["Boolean"] = "boolean";
  Type["Number"] = "number";
  Type["Integer"] = "integer";
  Type["String"] = "string";
  Type["Text"] = "text";
  Type["Object"] = "object";
  Type["Array"] = "array";
  Type["Primitives"] = "primitives";
  Type["Binary"] = "binary";
})(Type = exports.Type || (exports.Type = {}));
function buildKeys(m){
  var ks = Object.keys(m.attributes);
  var ps = [];
  for (var _i = 0, ks_1 = ks; _i < ks_1.length; _i++){
    var k = ks_1[_i];
    var attr = m.attributes[k];
    if (attr.key === true){
      ps.push(k);
    }
  }
  return ps;
}
exports.buildKeys = buildKeys;
function buildId(keys, props){
  if (!keys || keys.length === 0 || !props){
    return null;
  }
  var sp = (props.match ? props : props['props']);
  if (keys.length === 1){
    var x = sp.match.params[keys[0]];
    if (x && x !== ''){
      return x;
    }
    return sp.match.params['id'];
  }
  var id = {};
  for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++){
    var key = keys_1[_i];
    var v = sp.match.params[key];
    if (!v){
      v = sp[key];
      if (!v){
        return null;
      }
    }
    id[key] = v;
  }
  return id;
}
exports.buildId = buildId;
function dateToDefaultString(date){
  return '' + date.getFullYear() + '-' + addZero(date.getMonth() + 1, 2) + '-' + addZero(date.getDate(), 2);
}
exports.dateToDefaultString = dateToDefaultString;
function addZero(val, num){
  var v = val.toString();
  while (v.length < num){
    v = '0' + v;
  }
  return v.toString();
}
function initForm(form, initMat){
  if (form){
    setTimeout(function (){
      if (initMat){
        initMat(form);
      }
      form_util_1.focusFirstElement(form);
    }, 100);
  }
  return form;
}
exports.initForm = initForm;
