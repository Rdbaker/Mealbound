import { ICeraonModelAPI, ModelUpdateErrorCode, ModelUpdateResult } from '../../ICeraonModelAPI';
import CeraonModelAPI from '../../CeraonModelAPI';
import ModelTask from './ModelTask';
import Meal from '../../../State/Meal/Meal';
import * as Actions from '../../../Actions/Index';

export class MealLoadTask extends ModelTask<Meal> {
  constructor(private _api: ICeraonModelAPI, private _id: string, startLoading: boolean) {
    super(startLoading);
  }

  run(next?: (task: ModelTask<Meal>, result: Meal)=>void) {
    this._api.getMealById(this._id).then((meal: Meal) => {
      this.dispatchAction(Actions.createMealLoadedAction(meal));
      if (next) {
        next(this, meal);
      }
    });
  }
}