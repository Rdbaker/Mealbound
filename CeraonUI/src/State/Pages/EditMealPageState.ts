import Meal from '../Meal/Meal';

interface EditMealPageState {
  mealLoading: boolean;
  mealId: string;
  meal: Meal;
  failedToFindMeal: boolean;
}

export function defaultEditMealPageState() : EditMealPageState {
  return {
  mealLoading: false,
  mealId: null,
  meal: null,
  failedToFindMeal: false,
  };
}

export default EditMealPageState;
