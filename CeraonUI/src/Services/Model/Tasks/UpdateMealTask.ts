import { ICeraonModelAPI, ModelUpdateErrorCode, ModelUpdateResult } from '../../ICeraonModelAPI';
import CeraonModelAPI from '../../CeraonModelAPI';
import ModelTask from './ModelTask';
import Meal from '../../../State/Meal/Meal';
import * as Actions from '../../../Actions/Index';

export class UpdateMealTask extends ModelTask<ModelUpdateResult<Meal>> {
  constructor(private _api: ICeraonModelAPI, private _meal: Partial<Meal>, startLoading: boolean) {
    super(startLoading);
  }

  run(next?: (task: ModelTask<ModelUpdateResult<Meal>>, result: ModelUpdateResult<Meal>)=>void) {
    this._api.updateMeal(this._meal).then((result: ModelUpdateResult<Meal>) => {
      this.dispatchAction(Actions.createMealUpdatedAction(result));
      if (next) {
        next(this, result);
      }
    });
  }
}