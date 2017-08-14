import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import Meal from '../../State/Meal/Meal';

export interface SearchResultsLoadedAction extends CeraonAction {
  meals: Meal[];
}

export function createSearchResultsLoadedAction(meals: Meal[]) : SearchResultsLoadedAction {
  return {
    type: CeraonActionType.SearchResultsLoaded,
    meals: meals,
  };
}
