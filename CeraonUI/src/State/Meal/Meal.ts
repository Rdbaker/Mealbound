import Location from './Location';

interface Meal {
  name: string;
  description: string;
  scheduled_for: number;
  price: number;
  location: Location;
}

export default Meal;
