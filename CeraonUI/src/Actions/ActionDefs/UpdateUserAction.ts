import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import UserIdentity from '../../State/Identity/UserIdentity';

export interface UpdateUserAction extends CeraonAction {
  user: Partial<UserIdentity>;
}

export function createUpdateUserAction(user: Partial<UserIdentity>) : UpdateUserAction {
  return {
    type: CeraonActionType.UpdateUser,
    user: user,
  };
}
