import * as Redux from 'redux';
import CeraonState, { DEFAULT_CERAON_STATE } from '../State/CeraonState';
import CeraonReducer from './Reducers/CeraonReducer';
import ReduxLogger from './Middleware/ReduxLogging';
import APIDispatcher from './Middleware/CeraonAPIDispatcher';
import HistoryTracker from './Middleware/HistoryTracker';
import CeraonModel from '../Services/CeraonModel';
import HistoryService from '../Services/HistoryService';

let initialActions = HistoryService.getInitialActions();
let state = DEFAULT_CERAON_STATE;

state.userSessionInfo = CeraonModel.getUserSessionInfo();

for (let action of initialActions) {
  state = CeraonReducer(state, action);
}

const composeEnhancers = (<any> window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;

const ceraonStore : Redux.Store<CeraonState> = Redux.createStore(
    CeraonReducer,
    state,
    composeEnhancers(
      Redux.applyMiddleware(
        <Redux.Middleware> ReduxLogger,
        <Redux.Middleware> APIDispatcher,
        <Redux.Middleware> HistoryTracker,
      )
    )
);

function initStore() {
  HistoryService.onPageNavigation(ceraonStore.getState());

  for (let action of initialActions) {
    CeraonModel.onAction(ceraonStore.getState(), action);
  }
}

export default ceraonStore;
initStore();
