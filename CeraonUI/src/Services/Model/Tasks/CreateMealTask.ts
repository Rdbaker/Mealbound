import { ICeraonModelAPI, ModelUpdateErrorCode, ModelUpdateResult } from '../../ICeraonModelAPI';
import CeraonModelAPI from '../../CeraonModelAPI';
import ModelTask from './ModelTask';
import Meal from '../../../State/Meal/Meal';
import * as Actions from '../../../Actions/Index';

export class CreateMealTask extends ModelTask<ModelUpdateResult<Meal>> {
  constructor(private _api: ICeraonModelAPI, private _meal: Partial<Meal>, startLoading: boolean) {
    super(startLoading);
  }

  run(next?: (task: ModelTask<ModelUpdateResult<Meal>>, result: ModelUpdateResult<Meal>)=>void) {
    this._api.createMeal(this._meal).then((result: ModelUpdateResult<Meal>) => {
      this.dispatchAction(Actions.createMealCreatedAction(result));

      // TODO: Think about how we want to handle redirection like this
      // This probably isn't the right way
      this.dispatchAction(Actions.createViewMealAction(result.modelOnServer.id));
      if (next) {
        next(this, result);
      }
    });
  }
}