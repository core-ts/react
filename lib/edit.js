"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("./core");
function build(model) {
  if (!model) {
    return null;
  }
  if (core_1.resource.cache) {
    var meta = core_1.resource._cache[model.name];
    if (!meta) {
      meta = buildMetaModel(model);
      core_1.resource._cache[model.name] = meta;
    }
    return meta;
  }
  else {
    return buildMetaModel(model);
  }
}
exports.build = build;
function buildMetaModel(model) {
  if (model && !model.source) {
    model.source = model.name;
  }
  var md = {};
  var pks = new Array();
  var keys = Object.keys(model.attributes);
  for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
    var key = keys_1[_i];
    var attr = model.attributes[key];
    if (attr) {
      if (attr.version) {
        md.version = key;
      }
      if (attr.key === true) {
        pks.push(key);
      }
    }
  }
  md.keys = pks;
  return md;
}
function createModel(model) {
  var obj = {};
  if (!model) {
    return obj;
  }
  var attrs = Object.keys(model.attributes);
  for (var _i = 0, attrs_1 = attrs; _i < attrs_1.length; _i++) {
    var k = attrs_1[_i];
    var attr = model.attributes[k];
    switch (attr.type) {
      case 'string':
      case 'text':
        obj[attr.name] = '';
        break;
      case 'integer':
      case 'number':
        obj[attr.name] = 0;
        break;
      case 'array':
        obj[attr.name] = [];
        break;
      case 'boolean':
        obj[attr.name] = false;
        break;
      case 'date':
        obj[attr.name] = new Date();
        break;
      case 'object':
        if (attr.typeof) {
          var object = createModel(attr.typeof);
          obj[attr.name] = object;
          break;
        }
        else {
          obj[attr.name] = {};
          break;
        }
      case 'ObjectId':
        obj[attr.name] = null;
        break;
      default:
        obj[attr.name] = '';
        break;
    }
  }
  return obj;
}
exports.createModel = createModel;
function initPropertyNullInModel(obj, m) {
  if (!m) {
    var x = {};
    return x;
  }
  var model = createModel(m);
  for (var _i = 0, _a = Object.keys(model); _i < _a.length; _i++) {
    var key = _a[_i];
    if (obj && !obj.hasOwnProperty(key)) {
      obj[key] = model[key];
    }
  }
  return obj;
}
exports.initPropertyNullInModel = initPropertyNullInModel;
function handleStatus(x, st, gv, se) {
  var title = gv('error');
  if (x === st.VersionError) {
    se(gv('error_version'), title);
  }
  else if (x === st.DataCorrupt) {
    se(gv('error_data_corrupt'), title);
  }
  else {
    se(gv('error_internal'), title);
  }
}
exports.handleStatus = handleStatus;
function handleVersion(obj, version) {
  if (obj && version && version.length > 0) {
    var v = obj[version];
    if (v && typeof v === 'number') {
      obj[version] = v + 1;
    }
    else {
      obj[version] = 1;
    }
  }
}
exports.handleVersion = handleVersion;
