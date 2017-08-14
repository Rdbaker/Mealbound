import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';

export interface StartLoadingAction extends CeraonAction {
}

export function createStartLoadingAction() : StartLoadingAction {
  return {
    type: CeraonActionType.StartLoading,
  };
}
