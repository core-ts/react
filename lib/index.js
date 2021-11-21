"use strict";
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
__export(require("./formutil"));
__export(require("./util"));
__export(require("./core"));
__export(require("./state"));
__export(require("./edit"));
__export(require("./route"));
__export(require("./components"));
__export(require("./diff"));
__export(require("./router"));
__export(require("./merge"));
__export(require("./update"));
__export(require("./useView"));
__export(require("./useEdit"));
__export(require("./useSearch"));
__export(require("./useMessage"));
exports.withDefaultProps = function (Component) {
  return function (props) {
    return React.createElement(Component, { props: props, history: props.history });
  };
};
