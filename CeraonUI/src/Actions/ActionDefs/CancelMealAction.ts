import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';

export interface CancelMealAction extends CeraonAction {
  mealId: string;
}

export function createCancelMealAction(mealId: string) : CancelMealAction {
  return {
    type: CeraonActionType.CancelMeal,
    mealId: mealId,
  };
}
