import Meal from './Meal';
import UserIdentity from '../Identity/UserIdentity';

interface Review {
  id: string;
  rating: number;
  description: string;
  reviewer: UserIdentity;
  meal: Meal;
}

export default Review
