"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function useMergeState(initialState) {
  var _a = react_1.useState(initialState), state = _a[0], _setState = _a[1];
  var callbackRef = react_1.useRef();
  var isFirstCallbackCall = react_1.useRef(true);
  var setState = react_1.useCallback(function (newState, callback) {
    callbackRef.current = callback;
    _setState(function (prevState) { return Object.assign({}, prevState, newState); });
  }, []);
  react_1.useEffect(function () {
    if (isFirstCallbackCall.current) {
      isFirstCallbackCall.current = false;
      return;
    }
    if (callbackRef.current) {
      callbackRef.current(state);
    }
  }, [state]);
  return [state, setState];
}
exports.useMergeState = useMergeState;
