import { ICeraonModelAPI, ModelUpdateErrorCode, ModelUpdateResult } from '../../ICeraonModelAPI';
import CeraonModelAPI from '../../CeraonModelAPI';
import ModelTask from './ModelTask';
import Meal from '../../../State/Meal/Meal';
import * as Actions from '../../../Actions/Index';

export class MyMealLoadTask extends ModelTask<Array<Meal[]>> {
  constructor(private _api: ICeraonModelAPI, startLoading: boolean) {
    super(startLoading);
  }

  run(next?: (task: ModelTask<Array<Meal[]>>, result: Array<Meal[]>)=>void) {
    this._api.getMyHostedMeals().then((hostedMeals: Meal[]) => {
      this._api.getMyJoinedMeals().then((joinedMeals: Meal[]) => {
        this.dispatchAction(Actions.createMyMealsLoadedAction(hostedMeals, joinedMeals));
        if (next) {
          next(this, [hostedMeals, joinedMeals]);
        }
      });
    });
  }
}
