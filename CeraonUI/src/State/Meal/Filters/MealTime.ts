import MealSearchFilter from './MealSearchFilter';

export enum MealTime {
  Any = 1,
  Breakfast = 2,
  Lunch = 3,
  Dinner = 4,
}

export function MealTimeToString(mealTime: MealTime) : string {
  switch(mealTime) {
    case MealTime.Any:
      return 'Any Meal';
    case MealTime.Breakfast:
      return 'Breakfast';
    case MealTime.Lunch:
      return 'Lunch';
    case MealTime.Dinner:
      return 'Dinner';
  }

  return 'Unknown Meal Time!';
}

export class MealTimeFilter extends MealSearchFilter {
  constructor(private _mealTime: MealTime) {
    super();
  }

  getFriendlyDescription() : string {
    return 'Meal Time: ' + MealTimeToString(this._mealTime);
  }
  
}
