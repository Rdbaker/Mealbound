import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import Meal from '../../State/Meal/Meal';
import { ModelUpdateResult } from '../../Services/ICeraonModelAPI';

export interface MealCreatedAction extends CeraonAction {
  meal: ModelUpdateResult<Meal>;
}

export function createMealCreatedAction(meal: ModelUpdateResult<Meal>) : MealCreatedAction {
  return {
    type: CeraonActionType.MealCreated,
    meal: meal,
  };
}
