import Meal from '../Meal/Meal';

interface ViewMealPageState {
  meal: Meal;
  showUserLoginPrompt: boolean;
  isLoading: boolean;
  mealId: string;
  failedToFindMeal: boolean;
  isToggleJoinPending: boolean;
  isCancelPending: boolean;
  isReviewCreatePending: boolean;
  isReviewCreateSuccess: boolean;
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
    isReviewCreatePending: false,
    isReviewCreateSuccess: false,
  };
}

export default ViewMealPageState;
