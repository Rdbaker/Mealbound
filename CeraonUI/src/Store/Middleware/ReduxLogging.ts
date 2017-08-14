import * as Redux from 'redux';
import CeraonAction from '../../Actions/CeraonAction';
import CeraonState from '../../State/CeraonState';

// Redux middleware for simple logging to console

function reduxLogger(store: Redux.Store<CeraonState>) {
  return function loggerWrapper(next: (action: CeraonAction) => any) {
    return function logger(action: CeraonAction) {
      console.log('Dispatching: ', action);
      console.log('InitialState: ', store.getState());
      let result = next(action);
      console.log('ResultingState: ', store.getState());
      return result;
    }
  }
}

export default reduxLogger;