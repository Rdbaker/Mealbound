import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';

export interface GoToCreateMealAction extends CeraonAction {
}

export function createGoToCreateMealAction() : GoToCreateMealAction {
  return {
    type: CeraonActionType.GoToCreateMeal,
  };
}
