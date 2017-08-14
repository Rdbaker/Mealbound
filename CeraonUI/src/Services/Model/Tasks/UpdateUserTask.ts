import { ICeraonModelAPI, ModelUpdateErrorCode, ModelUpdateResult } from '../../ICeraonModelAPI';
import CeraonModelAPI from '../../CeraonModelAPI';
import ModelTask from './ModelTask';
import UserIdentity from '../../../State/Identity/UserIdentity';
import * as Actions from '../../../Actions/Index';

export class UpdateUserTask extends ModelTask<ModelUpdateResult<UserIdentity>> {
  constructor(private _api: ICeraonModelAPI, private _user: Partial<UserIdentity>, startLoading: boolean) {
    super(startLoading);
  }

  run(next?: (task: ModelTask<ModelUpdateResult<UserIdentity>>, result: ModelUpdateResult<UserIdentity>)=>void) {
    this._api.updateUserInfo(this._user).then((result: ModelUpdateResult<UserIdentity>) => {
      this.dispatchAction(Actions.createUserUpdatedAction(result));
      if (next) {
        next(this, result);
      }
    });
  }
}