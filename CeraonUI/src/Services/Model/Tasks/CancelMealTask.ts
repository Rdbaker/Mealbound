import { ICeraonModelAPI, ModelUpdateErrorCode, ModelUpdateResult } from '../../ICeraonModelAPI';
import CeraonModelAPI from '../../CeraonModelAPI';
import ModelTask from './ModelTask';
import * as Actions from '../../../Actions/Index';

export class CancelMealTask extends ModelTask<ModelUpdateResult<string>> {
  constructor(private _api: ICeraonModelAPI, private _mealId: string, startLoading: boolean) {
    super(startLoading);
  }

  run(next?: (task: ModelTask<ModelUpdateResult<string>>, result: ModelUpdateResult<string>)=>void) {
    this._api.deleteMeal(this._mealId).then((result: ModelUpdateResult<string>) => {
      this.dispatchAction(Actions.createMealCancelledAction(result));
      if (next) {
        next(this, result);
      }
    });
  }
}