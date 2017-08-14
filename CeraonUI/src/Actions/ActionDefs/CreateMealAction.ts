import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import Meal from '../../State/Meal/Meal';

export interface CreateMealAction extends CeraonAction {
  meal: Partial<Meal>;
}

export function createCreateMealAction(meal: Partial<Meal>) : CreateMealAction {
  return {
    type: CeraonActionType.CreateMeal,
    meal: meal,
  };
}
