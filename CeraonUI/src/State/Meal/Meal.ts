import Location from './Location';
import Review from './Review';
import UserIdentity from '../Identity/UserIdentity';
import Tag from './Tag';

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
  num_reviews: number;
  avg_rating: number;
  num_guests: number;
  max_guests: number;
  tags: Tag[];
}

export default Meal;
