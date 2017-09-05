import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import Meal from '../../State/Meal/Meal';

export interface HostedMealsLoadedAction extends CeraonAction {
  hostedMeals: Meal[];
}

export function createHostedMealsLoadedAction(hostedMeals: Meal[]) : HostedMealsLoadedAction {
  return {
    type: CeraonActionType.HostedMealsLoaded,
    hostedMeals: hostedMeals,
  };
}
