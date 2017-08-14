import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';

export interface GoToEditMealAction extends CeraonAction {
  mealId: string;
}

export function createGoToEditMealAction(mealId: string) : GoToEditMealAction {
  return {
    type: CeraonActionType.GoToEditMeal,
    mealId: mealId,
  };
}
