import { ICeraonModelAPI, ModelUpdateErrorCode, ModelUpdateResult } from '../../ICeraonModelAPI';
import CeraonModelAPI from '../../CeraonModelAPI';
import ModelTask from './ModelTask';
import Meal from '../../../State/Meal/Meal';
import * as Actions from '../../../Actions/Index';

export class JoinedMealsLoadTask extends ModelTask<Meal[]> {
  constructor(private _api: ICeraonModelAPI, startLoading: boolean) {
    super(startLoading);
  }

  run(next?: (task: ModelTask<Meal[]>, result: Meal[])=>void) {
    this._api.getMyJoinedMeals().then((joinedMeals: Meal[]) => {
      this.dispatchAction(Actions.createJoinedMealsLoadedAction(joinedMeals));
      if (next) {
        next(this, joinedMeals);
      }
    });
  }
}
