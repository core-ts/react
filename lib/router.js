"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
exports.useRouter = function () {
  var _a = [react_router_dom_1.useLocation(), react_router_dom_1.useHistory(), react_router_dom_1.useParams(), react_router_dom_1.useRouteMatch()], location = _a[0], history = _a[1], params = _a[2], match = _a[3];
  var navigate = function (targetUrl) {
    return function (e) {
      if (e) {
        e.preventDefault();
      }
      history.push(targetUrl);
    };
  };
  var back = function (e) {
    if (e) {
      e.preventDefault();
    }
    history.goBack();
  };
  return react_1.useMemo(function () {
    return ({
      push: history.push,
      replace: history.replace,
      pathname: location.pathname,
      goBack: history.goBack,
      match: match,
      location: location,
      history: history,
      params: params,
      navigate: navigate,
      back: back
    });
  }, [match, location, history, params]);
};
