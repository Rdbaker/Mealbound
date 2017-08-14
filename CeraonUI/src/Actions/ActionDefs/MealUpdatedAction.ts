import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import Meal from '../../State/Meal/Meal';
import { ModelUpdateResult } from '../../Services/ICeraonModelAPI';

export interface MealUpdatedAction extends CeraonAction {
  meal: ModelUpdateResult<Meal>;
}

export function createMealUpdatedAction(meal: ModelUpdateResult<Meal>) : MealUpdatedAction {
  return {
    type: CeraonActionType.MealUpdated,
    meal: meal,
  };
}
