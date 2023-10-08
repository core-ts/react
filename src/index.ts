import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
export * from './formutil';
export * from './util';
export * from './core';
export * from './state';
export * from './edit';
export * from './route';
export * from './diff';
export * from './merge';
export * from './update';
export * from './useSearch';
export * from './useMessage';
export * from './useEdit';
export * from './components';
export * from './search';
export * from './reflect';
export * from './com';

type CallBackType<T> = (updatedValue: T) => void;
type SetStateType<T> = T | ((prev: T) => T);
type RetType = <T>(initialValue: T | (() => T)) => [T, (newValue: SetStateType<T>, callback?: CallBackType<T>) => void];

export const useCallbackState: RetType = <T>(initialValue: T | (() => T)) => {
  const [state, _setState] = useState<T>(initialValue);
  const callbackQueue = useRef<CallBackType<T>[]>([]);

  useEffect(() => {
    callbackQueue.current.forEach((cb) => cb(state));
    callbackQueue.current = [];
  }, [state]);

  const setState = (newValue: SetStateType<T>, callback?: CallBackType<T>) => {
    _setState(newValue);
    if (callback && typeof callback === "function") {
      callbackQueue.current.push(callback);
    }
  };
  return [state, setState];
};

export function checked(s: string[]|string|undefined, v: string): boolean|undefined {
  if (s) {
    if (Array.isArray(s)) {
      return s.includes(v);
    } else {
      return s === v;
    }
  }
  return false;
}
export function value<T>(obj?: T): T {
  return (obj ? obj : {} as any);
}
export interface LoadingProps {
  error?: any;
}
export const Loading = (props: LoadingProps) => {
  const loadingStyle = {
    top: '30%',
    backgroundColor: 'white',
    border: 'none',
    'WebkitBoxShadow': 'none',
    'boxShadow': 'none'
  };
  if (props.error) {
    return React.createElement('div', null, 'Error Load Module!'); // return (<div>Error Load Module!</div>);
  } else {
    return (React.createElement('div', { className: 'loader-wrapper' }, React.createElement('div', { className: 'loader-sign', style: loadingStyle }, React.createElement('div', { className: 'loader' }))));
    /*
    return (
      <div className='loader-wrapper'>
        <div className='loader-sign' style={loadingStyle}>
          <div className='loader' />
        </div>
      </div>
    );*/
  }
};
export type OnClick = React.MouseEvent<HTMLElement, MouseEvent>;
