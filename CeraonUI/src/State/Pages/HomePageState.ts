import Meal from '../Meal/Meal';

interface HomePageState {
  headerMessage: string;
  showMealSearchDropdown: boolean;
  mealSearchDropdownText: string;

  myJoinedMeals: Meal[];
  myHostedMeals: Meal[];
  showMyMealInfo: boolean;
  myMealInfoLoading: boolean;
}

export function defaultHomePageState() : HomePageState {
  return {
  headerMessage: 'Find a place nearby to eat',
  showMealSearchDropdown: true,
  mealSearchDropdownText: 'Any Time',
  myJoinedMeals: [],
  myHostedMeals: [],
  myMealInfoLoading: false,
  showMyMealInfo: false,
  };
}

export default HomePageState;
