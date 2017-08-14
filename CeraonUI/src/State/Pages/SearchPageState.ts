import MealSearchFilter from '../Meal/Filters/MealSearchFilter';
import Meal from '../Meal/Meal';
import MealTime from '../Meal/Filters/MealTime';

interface SearchPageState {
  filters: MealSearchFilter;
  totalResults: number;
  currentResultsStartingIndex: number;
  results: Meal[];
  isLoading: boolean;
}

export function defaultSearchPageState(): SearchPageState {
   return {
    filters: {
      mealTime: MealTime.Any,
      textFilter: [],
    },
    totalResults: 0,
    currentResultsStartingIndex: 0,
    results: [],
    isLoading: true,
  };
}

export default SearchPageState;
