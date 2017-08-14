import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import Meal from '../../State/Meal/Meal';

export interface MyMealsLoadedAction extends CeraonAction {
  hostedMeals: Meal[];
  joinedMeals: Meal[];
}

export function createMyMealsLoadedAction(hostedMeals: Meal[], joinedMeals: Meal[]) : MyMealsLoadedAction {
  return {
    type: CeraonActionType.MyMealsLoaded,
    hostedMeals: hostedMeals,
    joinedMeals: joinedMeals,
  };
}
