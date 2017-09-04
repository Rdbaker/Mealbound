import Location from './Location';
import Review from './Review';
import UserIdentity from '../Identity/UserIdentity';

interface Meal {
  id: string;
  name: string;
  description: string;
  scheduled_for: string;
  price: number;
  host: UserIdentity;
  location: Location;
  joined: boolean;
  mine: boolean;
  my_review: Review;
}

export default Meal;
