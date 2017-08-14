import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import Meal from '../../State/Meal/Meal';

export interface MealLoadedAction extends CeraonAction {
  meal: Meal;
}

export function createMealLoadedAction(meal: Meal) : MealLoadedAction {
  return {
    type: CeraonActionType.MealLoaded,
    meal: meal,
  };
}
