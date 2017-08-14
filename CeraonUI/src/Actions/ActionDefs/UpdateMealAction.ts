import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import Meal from '../../State/Meal/Meal';

export interface UpdateMealAction extends CeraonAction {
  meal: Partial<Meal>;
}

export function createUpdateMealAction(meal: Partial<Meal>) : UpdateMealAction {
  return {
    type: CeraonActionType.UpdateMeal,
    meal: meal,
  };
}
