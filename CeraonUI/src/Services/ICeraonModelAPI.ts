import UserSessionInfo from '../State/Identity/UserSessionInfo';
import Meal from '../State/Meal/Meal';
import Location from '../State/Meal/Location';
import MealSearchFilter from '../State/Meal/Filters/MealSearchFilter';
import UserIdentity, { UserIdentityUpdateModel } from '../State/Identity/UserIdentity';

export enum ModelUpdateErrorCode {
  Success,
  NotFound,
  NotAuthorized
}

export interface ModelUpdateResult<ModelType> {
  success: boolean;
  errorCode: ModelUpdateErrorCode;
  errorString: string;
  modelOnServer: ModelType;
}

export interface ICeraonModelAPI {
  getUserSessionInfo() : UserSessionInfo;
  getStripeKey() : string;

  updatePaymentInfo(stripeToken: string): Promise<ModelUpdateResult<string>>;
  updateUserInfo(userInfo: Partial<UserIdentityUpdateModel>): Promise<ModelUpdateResult<UserIdentity>>;

  getLocationById(id: string): Promise<Location>;
  getMyLocation(): Promise<Location>;
  updateMyLocation(location: Location): Promise<ModelUpdateResult<Location>>;

  getMealById(id: string): Promise<Meal>;
  getMyJoinedMeals(): Promise<Meal[]>;
  getMyHostedMeals(): Promise<Meal[]>;
  filterMeals(filters: MealSearchFilter): Promise<Meal[]>;

  deleteMeal(id: string): Promise<ModelUpdateResult<string>>;
  updateMeal(meal: Partial<Meal>): Promise<ModelUpdateResult<Meal>>;
  toggleJoinMeal(id: string, join: boolean): Promise<ModelUpdateResult<Meal>>;
  createMeal(meal: Partial<Meal>): Promise<ModelUpdateResult<Meal>>;
};
