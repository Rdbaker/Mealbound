import { ICeraonModelAPI, ModelUpdateErrorCode, ModelUpdateResult } from '../ICeraonModelAPI';
import UserSessionInfo from '../../State/Identity/UserSessionInfo';
import Meal from '../../State/Meal/Meal';
import Location from '../../State/Meal/Location';
import MealSearchFilter from '../../State/Meal/Filters/MealSearchFilter';
import UserIdentity, { UserIdentityUpdateModel } from '../../State/Identity/UserIdentity';

export default class MockCeraonModelAPI implements ICeraonModelAPI {
  constructor() {
  }

  private _mockLocation : Location = {
    id: '1902831',
    name: 'Test Location',
    numDollarSigns: 5,
    rating: 3.8,
    latitude: 0,
    longitude: 0,
    address: 'Test Address',
    phone: '(555)-555-5555',
  };

  private _mockMeals : Meal[] = [
    {
      id: '1',
      name: 'Test Meal 1',
      description: 'This is a test meal',
      scheduled_for: '',
      price: 4.50,
      location: this._mockLocation,
      joined: false,
      mine: false,
      host: null,
    },
    {
      id: '2',
      name: 'Test Meal 2',
      description: 'This is a test meal 2',
      scheduled_for: '',
      price: 4.50,
      location: this._mockLocation,
      joined: false,
      mine: false,
      host: null,
    },
    {
      id: '3',
      name: 'Test Meal 3',
      description: 'This is a test meal 3',
      scheduled_for: '',
      price: 4.50,
      location: this._mockLocation,
      joined: false,
      mine: true,
      host: null,
    },
    {
      id: '4',
      name: 'Test Meal 4',
      description: 'This is a test meal 4',
      scheduled_for: '',
      price: 4.50,
      location: this._mockLocation,
      joined: false,
      mine: true,
      host: null,
    }
  ];

  getUserSessionInfo() : UserSessionInfo {
    return {
      isUserAuthenticated: true,
      userIdentity: {
        id: '1',
        first_name: 'Test',
        last_name: 'User',
        public_name: 'Test User',
        image_url: '',
        created_at: '',
        email: '',
        address: '',
      }
    };
  }

  getStripeKey() : string{
    return 'tok_testingtesting123';
  }

  updateUserInfo(userInfo: Partial<UserIdentityUpdateModel>): Promise<ModelUpdateResult<UserIdentity>> {
    return Promise.resolve(null);
  }

  updatePaymentInfo(stripeToken: string): Promise<ModelUpdateResult<string>> {
    return Promise.resolve(null);
  }

  getLocationById(id: string): Promise<Location> {
    return Promise.resolve(null);
  }

  getMyLocation(): Promise<Location> {
    return Promise.resolve(null);
  }

  updateMyLocation(location: Location): Promise<ModelUpdateResult<Location>> {
    return Promise.resolve(null);
  }

  getMealById(id: string): Promise<Meal> {
    return new Promise<Meal>((resolve) => {
      let index = this._mockMeals.findIndex((meal: Meal) => {
        return meal.id == id;
      });

      let meal = null;
      if (index > -1) {
        meal = this._mockMeals[index];
      }

      // Make it appear async
      setTimeout(() => { resolve(meal) }, 1000);
    });
  }

  getMyJoinedMeals(): Promise<Meal[]> {
    return new Promise<Meal[]>((resolve) => {
      setTimeout(()=> { resolve(this._mockMeals.filter((meal: Meal) => meal.joined)) }, 1000);
    });
  }

  getMyHostedMeals(): Promise<Meal[]> {
    return new Promise<Meal[]>((resolve) => {
      setTimeout(()=> { resolve(this._mockMeals.filter((meal: Meal) => meal.mine)) }, 1000);
    });
  }

  filterMeals(filters: MealSearchFilter): Promise<Meal[]> {
    return new Promise<Meal[]>((resolve) => {
      setTimeout(()=>{ resolve(this._mockMeals.filter((meal: Meal) => !meal.mine)) }, 1000);
    });
  }

  deleteMeal(id: string): Promise<ModelUpdateResult<string>> {
    return new Promise<ModelUpdateResult<string>>((resolve) => {
      let index = this._mockMeals.findIndex((meal: Meal) => meal.id == id);

      if (index > -1) {
        this._mockMeals.splice(index, 1);
      }

      setTimeout(()=>{ resolve({ success:true, errorCode: ModelUpdateErrorCode.Success, errorString: '', modelOnServer: id})}, 1000);
    });
  }

  toggleJoinMeal(id: string, join: boolean): Promise<ModelUpdateResult<Meal>> {
    return null;
  }

  updateMeal(meal: Partial<Meal>): Promise<ModelUpdateResult<Meal>> {
    return new Promise<ModelUpdateResult<Meal>>((resolve) => {
      let index = this._mockMeals.findIndex((oMeal: Meal) => meal.id == oMeal.id);

      let result : ModelUpdateResult<Meal> = null;
      if (index > -1) {
        this._mockMeals[index] = Object.assign(this._mockMeals[index], meal);
        result = <ModelUpdateResult<Meal>>{
            success: true,
            errorCode: ModelUpdateErrorCode.Success,
            modelOnServer: meal,
            errorString: '',
          };
      } else {
        result = <ModelUpdateResult<Meal>>{
          success: false,
          errorCode: ModelUpdateErrorCode.NotFound,
          modelOnServer: null,
          errorString: '',
        };
      }

      setTimeout(()=>{(resolve(result))}, 1000);
    });
  }

  createMeal(meal: Partial<Meal>): Promise<ModelUpdateResult<Meal>> {
    return Promise.resolve(null);
  }
}
