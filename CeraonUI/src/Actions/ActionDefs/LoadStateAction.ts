import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import CeraonState from '../../State/CeraonState';

export interface LoadStateAction extends CeraonAction {
  state: CeraonState;
}

export function createLoadStateAction(state: CeraonState) : LoadStateAction {
  return {
    type: CeraonActionType.LoadState,
    state: state,
  };
}
