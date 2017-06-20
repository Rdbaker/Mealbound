import CeraonAction from './CeraonAction';
import CeraonActionType from './CeraonActionType';
import {MealTime} from '../State/Meal/Filters/MealTime';
import MealSearchFilter from '../State/Meal/Filters/MealSearchFilter';

export enum MealSearchActionType {
  AddFilter,
  RemoveFilter
}

export interface MealSearchAction extends CeraonAction {
  searchActionType: MealSearchActionType;
  filter: MealSearchFilter;
}

export default function createMealSearchAction(actionType: MealSearchActionType, mealSearchFilter: MealSearchFilter) : MealSearchAction {
  return {
    type: CeraonActionType.MealSearch,
    searchActionType: actionType,
    filter: mealSearchFilter,
  };
}
