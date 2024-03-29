import { ICeraonModelAPI, ModelUpdateErrorCode, ModelUpdateResult } from '../../ICeraonModelAPI';
import CeraonModelAPI from '../../CeraonModelAPI';
import ModelTask from './ModelTask';
import Meal from '../../../State/Meal/Meal';
import * as Actions from '../../../Actions/Index';

export class HostedMealsLoadTask extends ModelTask<Meal[]> {
  constructor(private _api: ICeraonModelAPI, startLoading: boolean) {
    super(startLoading);
  }

  run(next?: (task: ModelTask<Meal[]>, result: Meal[])=>void) {
    this._api.getMyHostedMeals().then((hostedMeals: Meal[]) => {
      this.dispatchAction(Actions.createHostedMealsLoadedAction(hostedMeals));
      if (next) {
        next(this, hostedMeals);
      }
    });
  }
}
