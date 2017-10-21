import MealTime from './MealTime';
import Tag from '../Tag';

interface MealSearchFilter {
  mealTime: MealTime;
  textFilter: string[];
  tagsFilter: Tag[];
}

export default MealSearchFilter;
