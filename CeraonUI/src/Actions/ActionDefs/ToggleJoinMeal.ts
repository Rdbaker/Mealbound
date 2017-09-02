import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import Meal from '../../State/Meal/Meal';

export interface ToggleJoinMealAction extends CeraonAction {
  id: string;
  join: boolean;
  stripeToken?: string;
}

export function createToggleJoinMealAction(id: string, join: boolean, stripeToken?: string) : ToggleJoinMealAction {
  let action;

  if (stripeToken) {
    action = {
      type: CeraonActionType.ToggleJoinMeal,
      id: id,
      join: join,
      stripeToken: stripeToken
    };
  } else {
    action = {
      type: CeraonActionType.ToggleJoinMeal,
      id: id,
      join: join
    };
  }

  return action;
}
