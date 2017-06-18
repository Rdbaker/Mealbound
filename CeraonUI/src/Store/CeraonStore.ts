import * as Redux from 'redux';
import CeraonState from '../State/CeraonState';
import CeraonReducer from './Reducers/CeraonReducer';
import { DEFAULT_NAVIGATION_BAR_STATE } from '../State/NavigationBarState';
import { DEFAULT_USER_SESSION_INFO } from '../State/Identity/UserSessionInfo';

const initialState: CeraonState = {
  userSessionInfo: DEFAULT_USER_SESSION_INFO,
  navigationBarState: DEFAULT_NAVIGATION_BAR_STATE,
};

const ceraonStore = Redux.createStore(CeraonReducer, initialState);
export default ceraonStore;
