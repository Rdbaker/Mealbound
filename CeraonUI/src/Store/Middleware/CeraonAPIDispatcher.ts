import * as Redux from 'redux';
import CeraonAction from '../../Actions/CeraonAction';
import CeraonState from '../../State/CeraonState';
import CeraonModel from '../../Services/CeraonModel';

// Redux middleware for dispatching actions to corresponding Ceraon API calls

function ceraonAPIDispatcher(store: Redux.Store<CeraonState>) {
  return function apiDispatcherWrapper(next: (action: CeraonAction) => any) {
    return function apiDispatcher(action: CeraonAction) {
      let result = next(action);
      CeraonModel.onAction(store.getState(), action);
      return result;
    }
  }
}

export default ceraonAPIDispatcher;