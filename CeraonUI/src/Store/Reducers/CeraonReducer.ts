import CeraonState from '../../State/CeraonState';
import CeraonAction from '../../Actions/CeraonAction';
import CeraonActionType from '../../Actions/CeraonActionType';
import CeraonPage from '../../State/CeraonPage';

export default function ceraonReducer(state: CeraonState, action: CeraonAction) : CeraonState {

  if (action.type === CeraonActionType.Login) {
    state.activePage = CeraonPage.Loading;
    state.loadingPageState.loadingStatusMessage = 'Logging you in...';
  }

  return state;
}
