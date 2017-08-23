import { ICeraonModelAPI, ModelUpdateErrorCode, ModelUpdateResult } from '../../ICeraonModelAPI';
import CeraonModelAPI from '../../CeraonModelAPI';
import ModelTask from './ModelTask';
import * as Actions from '../../../Actions/Index';

export class UpdatePaymentInfoTask extends ModelTask<ModelUpdateResult<string>> {
  constructor(private _api: ICeraonModelAPI, private _stripeToken: string, startLoading: boolean) {
    super(startLoading);
  }

  run(next?: (task: ModelTask<ModelUpdateResult<string>>, result: ModelUpdateResult<string>) => void) {
    this._api.updatePaymentInfo(this._stripeToken).then((result: ModelUpdateResult<string>) => {
      if (next) {
        next(this, result);
      }
    });
  }
}
