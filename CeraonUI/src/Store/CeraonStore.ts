import * as Redux from 'redux';
import CeraonState from '../State/CeraonState';
import ceraonReducer from './Reducers/CeraonReducer';

const initialState : CeraonState = {
	userSessionInfo: {
		isUserAuthenticated: false,
		sessionExpiryTime: Date.now(),
		sessionToken: "",
		userIdentity: null
	},
	navigationBarState: {
		navigationTitle: "Ceraon",
		showSearchBox: true,
		searchBoxText: ""
	}
}

const CeraonStore = Redux.createStore(ceraonReducer, initialState);
export default CeraonStore;