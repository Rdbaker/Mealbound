import * as Redux from 'redux';
import CeraonAction from '../../Actions/CeraonAction';
import CeraonActionType from '../../Actions/CeraonActionType';
import CeraonState from '../../State/CeraonState';
import HistoryService from '../../Services/HistoryService';
import * as CeraonPageUtils from '../../State/Utils/CeraonPageUtils';

// Redux middleware for logging and tracking history

function reduxHistoryTracker(store: Redux.Store<CeraonState>) {
  return function historyTrackerLogger(next: (action: CeraonAction) => any) {
    return function historyTracker(action: CeraonAction) {
      let currentUrl = CeraonPageUtils.CeraonPageToUrl[store.getState().activePage](store.getState());
      let result = next(action);
      let newUrl = CeraonPageUtils.CeraonPageToUrl[store.getState().activePage](store.getState());

      if (action.type != CeraonActionType.LoadState) {
        if (currentUrl != newUrl) {
          HistoryService.onPageNavigation(store.getState());
        } else {
          HistoryService.onPageStateUpdated(store.getState());
        }
      }

      return result;
    }
  }
}

export default reduxHistoryTracker;