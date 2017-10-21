import MealSearchFilter from '../Meal/Filters/MealSearchFilter';
import Meal from '../Meal/Meal';
import Tag from '../Meal/Tag';
import MealTime from '../Meal/Filters/MealTime';

interface SearchPageState {
  filters: MealSearchFilter;
  totalResults: number;
  currentResultsStartingIndex: number;
  mealTags: Tag[];
  results: Meal[];
  isLoading: boolean;
}

export function defaultSearchPageState(): SearchPageState {
   return {
    filters: {
      mealTime: MealTime.Any,
      textFilter: [],
      tagsFilter: [],
    },
    totalResults: 0,
    currentResultsStartingIndex: 0,
    mealTags: [],
    results: [],
    isLoading: true,
  };
}

export default SearchPageState;
