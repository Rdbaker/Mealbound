import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import { ModelUpdateResult } from '../../Services/ICeraonModelAPI';

export interface MealCancelledAction extends CeraonAction {
  mealId: ModelUpdateResult<string>;
}

export function createMealCancelledAction(mealId: ModelUpdateResult<string>) : MealCancelledAction {
  return {
    type: CeraonActionType.MealCancelled,
    mealId: mealId,
  };
}
