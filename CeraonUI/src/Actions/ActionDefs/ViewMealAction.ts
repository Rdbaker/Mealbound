import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';

export interface ViewMealAction extends CeraonAction {
  mealId: string;
}

export function createViewMealAction(id: string) : ViewMealAction {
  return {
    type: CeraonActionType.ViewMeal,
    mealId: id,
  };
}
