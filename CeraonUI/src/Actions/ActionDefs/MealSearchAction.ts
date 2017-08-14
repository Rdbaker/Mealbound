import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import MealSearchFilter from '../../State/Meal/Filters/MealSearchFilter';

export interface MealSearchAction extends CeraonAction {
  filter: MealSearchFilter;
}

export function createMealSearchAction(mealSearchFilter: MealSearchFilter) : MealSearchAction {
  return {
    type: CeraonActionType.MealSearch,
    filter: mealSearchFilter,
  };
}
