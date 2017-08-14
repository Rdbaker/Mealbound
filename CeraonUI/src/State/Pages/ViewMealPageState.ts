import Meal from '../Meal/Meal';

interface ViewMealPageState {
  meal: Meal;
  showUserLoginPrompt: boolean;
  isLoading: boolean;
  mealId: string;
  failedToFindMeal: boolean;
  isToggleJoinPending: boolean;
  isCancelPending: boolean;
}

export function defaultViewMealPageState(): ViewMealPageState {
   return {
    meal: undefined,
    showUserLoginPrompt: true,
    isLoading: true,
    mealId: undefined,
    failedToFindMeal: false,
    isToggleJoinPending: false,
    isCancelPending: false,
  };
}

export default ViewMealPageState;
