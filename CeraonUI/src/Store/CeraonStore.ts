import * as Redux from 'redux';
import CeraonState, { DEFAULT_CERAON_STATE } from '../State/CeraonState';
import CeraonReducer from './Reducers/CeraonReducer';

const ceraonStore = Redux.createStore(CeraonReducer, DEFAULT_CERAON_STATE);
export default ceraonStore;
