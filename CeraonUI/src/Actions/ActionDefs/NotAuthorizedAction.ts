import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';

export interface NotAuthorizedAction extends CeraonAction {
}

export function createNotAuthorizedAction() : NotAuthorizedAction {
  return {
    type: CeraonActionType.NotAuthorized,
  };
}
