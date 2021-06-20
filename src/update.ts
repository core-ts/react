import {getModelName as getModelName2, Locale, ModelProps, removePhoneFormat} from './core';
import {useMergeState} from './merge';
import {buildFlatState, buildState, handleEvent, handleProps, localeOf} from './state';

export const useBase = <T>(initialState: T, getLocale?: () => Locale, removeErr?: (ctrl: HTMLInputElement) => void, getName?: (f?: HTMLFormElement) => string) => {
  const [state, setState] = useMergeState<T>(initialState);

  const updatePhoneState = (event: any) => {
    const re = /^[0-9\b]+$/;
    const target = event.currentTarget as HTMLInputElement;
    const value = removePhoneFormat(target.value);
    if (re.test(value) || !value) {
      updateState(event);
    } else {
      const splitArr = value.split('');
      let responseStr = '';
      splitArr.forEach(element => {
        if (re.test(element)) {
          responseStr += element;
        }
      });
      target.value = responseStr;
      updateState(event);
    }
  };
  const _getModelName = (f?: HTMLFormElement) => {
    let f2 = f;
    if (!f2) {
      f2 = this.form;
    }
    if (f2) {
      const a = getModelName2(f2);
      if (a && a.length > 0) {
        return a;
      }
    }
    return 'model';
  };
  const getModelName = getName ? getName : _getModelName;
  const updateState = (e: any, callback?: () => void, lc?: Locale) => {
    const ctrl = e.currentTarget as HTMLInputElement;
    const modelName = getModelName(ctrl.form);
    const l = localeOf(lc, getLocale);
    handleEvent(e, removeErr);
    const objSet = buildState(e, state, ctrl, modelName, l);
    if (objSet) {
      if (callback) {
        setState(objSet, callback);
      } else {
        setState(objSet);
      }
    }
  };

  const updateFlatState = (e: any, callback?: () => void, lc?: Locale) => {
    const l = localeOf(lc, this.getLocale);
    const objSet = buildFlatState(e, state, l);
    if (objSet) {
      if (callback) {
        setState(objSet, callback);
      } else {
        setState(objSet);
      }
    }
  };

  return {
    getModelName,
    updateState,
    updatePhoneState,
    updateFlatState,
    getLocale,
    setState,
    state
  };
};
function prepareData(data: any): void {
}
export const useBaseProps = <T, P extends ModelProps>(props: P, initialState: T, gl?: () => Locale, removeErr?: (ctrl: HTMLInputElement) => void, getName?: (f?: HTMLFormElement) => string, prepareCustomData?: (d: any) => void) => {
  if (!prepareCustomData) {
    prepareCustomData = prepareData;
  }
  const baseProps = useBase<T>(initialState, gl, removeErr, getName);
  const {getModelName, updatePhoneState, updateFlatState, getLocale, state, setState} = baseProps;

  const updateState = (e: any, callback?: () => void, lc?: Locale) => {
    const ctrl = e.currentTarget as HTMLInputElement;
    const modelName = getModelName(ctrl.form);
    const l = localeOf(lc, gl);
    handleEvent(e, removeErr);
    if (props.setGlobalState) {
      handleProps<P>(e, props, ctrl, modelName, l, prepareCustomData);
    } else {
      const objSet = buildState(e, state, ctrl, modelName, l);
      if (objSet) {
        if (callback) {
          setState(objSet, callback);
        } else {
          setState(objSet);
        }
      }
    }
  };

  return {
    getModelName,
    updateState,
    updatePhoneState,
    updateFlatState,
    getLocale,
    setState,
    state
  };
};
