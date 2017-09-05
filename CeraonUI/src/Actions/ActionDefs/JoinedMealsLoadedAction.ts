import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import Meal from '../../State/Meal/Meal';

export interface JoinedMealsLoadedAction extends CeraonAction {
  joinedMeals: Meal[];
}

export function createJoinedMealsLoadedAction(joinedMeals: Meal[]) : JoinedMealsLoadedAction {
  return {
    type: CeraonActionType.JoinedMealsLoaded,
    joinedMeals: joinedMeals,
  };
}
