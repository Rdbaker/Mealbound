import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import Meal from '../../State/Meal/Meal';

export interface ToggleJoinMealAction extends CeraonAction {
  id: string;
  join: boolean;
}

export function createToggleJoinMealAction(id: string, join: boolean) : ToggleJoinMealAction {
  return {
    type: CeraonActionType.ToggleJoinMeal,
    id: id,
    join: join,
  };
}
