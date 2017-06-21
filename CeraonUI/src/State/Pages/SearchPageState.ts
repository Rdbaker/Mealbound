import MealSearchFilter from '../Meal/Filters/MealSearchFilter';
import Meal from '../Meal/Meal';


interface SearchPageState {
  filters: MealSearchFilter[];
  totalResults: number;
  currentResultsStartingIndex: number;
  results: Meal[];
}

export const DEFAULT_SEARCH_PAGE_STATE: SearchPageState = {
  filters: [],
  totalResults: 0,
  currentResultsStartingIndex: 0,
  results: [],
};

export default SearchPageState;
