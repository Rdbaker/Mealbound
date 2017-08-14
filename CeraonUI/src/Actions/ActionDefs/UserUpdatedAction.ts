import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import UserIdentity from '../../State/Identity/UserIdentity';
import { ModelUpdateResult } from '../../Services/ICeraonModelAPI';

export interface UserUpdatedAction extends CeraonAction {
  user: ModelUpdateResult<UserIdentity>;
}

export function createUserUpdatedAction(user: ModelUpdateResult<UserIdentity>) : UserUpdatedAction {
  return {
    type: CeraonActionType.UserUpdated,
    user: user,
  };
}
