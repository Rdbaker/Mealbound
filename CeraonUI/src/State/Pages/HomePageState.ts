import { MealTime } from '../Meal/Filters/MealTime';


interface HomePageState {
  headerMessage: string;
  showMealSearchDropdown: boolean;
  searchMealTimeOptions: MealTime[];
}

export const DEFAULT_HOME_PAGE_STATE: HomePageState = {
  headerMessage: 'Find a place nearby to eat',
  showMealSearchDropdown: true,
  searchMealTimeOptions: [MealTime.Any, MealTime.Breakfast, MealTime.Lunch, MealTime.Dinner],
};

export default HomePageState;
