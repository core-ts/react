"use strict";
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./util"));
__export(require("./edit"));
__export(require("./core"));
__export(require("./route"));
__export(require("./BaseComponent"));
var DiffApprComponent_1 = require("./DiffApprComponent");
exports.BaseDiffApprComponent = DiffApprComponent_1.BaseDiffApprComponent;
exports.DiffApprComponent = DiffApprComponent_1.DiffApprComponent;
exports.formatDiffModel = DiffApprComponent_1.formatDiffModel;
