import * as React from 'react';
import { RouteComponentProps } from 'react-router';
export * from './formutil';
export * from './util';
export * from './core';
export * from './state';
export * from './edit';
export * from './route';
export * from './components';
export * from './diff';
export * from './router';
export * from './merge';
export * from './update';
export * from './useView';
export * from './useEdit';
export * from './useSearch';
export * from './useMessage';

export const withDefaultProps = (Component: any) => (props: RouteComponentProps) => {
  // return <Component props={props} history={props.history} />;
  return React.createElement(Component, { props, history: props.history });
};
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
