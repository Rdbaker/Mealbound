import { ICeraonModelAPI, ModelUpdateErrorCode, ModelUpdateResult } from '../../ICeraonModelAPI';
import CeraonModelAPI from '../../CeraonModelAPI';
import ModelTask from './ModelTask';
import Meal from '../../../State/Meal/Meal';
import * as Actions from '../../../Actions/Index';
import MealSearchFilter from '../../../State/Meal/Filters/MealSearchFilter';

export class MealSearchTask extends ModelTask<Meal[]> {
  constructor(private _api: ICeraonModelAPI, private _filters: MealSearchFilter, startLoading: boolean) {
    super(startLoading);
  }

  run(next?: (task: ModelTask<Meal[]>, result: Meal[])=>void) {
    this._api.filterMeals(this._filters).then((meals: Meal[]) => {
      this.dispatchAction(Actions.createSearchResultsLoadedAction(meals));
      if (next) {
        next(this, meals);
      }
    });
  }
}
