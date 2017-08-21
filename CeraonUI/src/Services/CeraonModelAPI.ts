import { ICeraonModelAPI, ModelUpdateErrorCode, ModelUpdateResult } from './ICeraonModelAPI';
import UserSessionInfo from '../State/Identity/UserSessionInfo';
import Meal from '../State/Meal/Meal';
import MealTime from '../State/Meal/Filters/MealTime';
import Location from '../State/Meal/Location';
import MealSearchFilter from '../State/Meal/Filters/MealSearchFilter';
import UserIdentity, { UserIdentityUpdateModel } from '../State/Identity/UserIdentity';
import axios from 'axios';
import * as fuse from 'fuse.js';

export default class CeraonModelAPI implements ICeraonModelAPI {
  private _userSessionInfo: UserSessionInfo = { isUserAuthenticated: false, userIdentity: null };
  private _joinedMealsIdsList: Array<String> = [];
  private _csrfToken: string = '';
  private _stripeKey: string = '';

  private _jobQueue = [];

  constructor() {
    // Immediately load user session info from page meta
    let currentUserMeta : Element = document.querySelector('meta[name="current-user"]');
    let currentUser = currentUserMeta && currentUserMeta.getAttribute('content');

    if (currentUser) {
      let userIdentity : UserIdentity = JSON.parse(currentUser);
      if (userIdentity.id) {
        this._userSessionInfo.isUserAuthenticated = true;
        this._userSessionInfo.userIdentity = userIdentity;
      }
    }

    // Get CSRF token
    let csrfMeta : Element = document.querySelector('meta[name="csrf"]');
    let csrf = csrfMeta && csrfMeta.getAttribute('content');

    if (csrf) {
      this._csrfToken = csrf;
    }

    // Get the public Stripe token
    let stripeMeta : Element = document.querySelector('meta[name="stripe-pub-key"]');
    let stripeKey = stripeMeta && stripeMeta.getAttribute('content');

    if (stripeKey) {
      this._stripeKey = stripeKey;
    }

    this.appendMealOwnerDetails = this.appendMealOwnerDetails.bind(this);
    this.createMeal = this.createMeal.bind(this);
    this.deleteMeal = this.deleteMeal.bind(this);
    this.filterMeals = this.filterMeals.bind(this);
    this.getLocationById = this.getLocationById.bind(this);
    this.getMealById = this.getMealById.bind(this);
    this.getMyHostedMeals = this.getMyHostedMeals.bind(this);
    this.getMyJoinedMeals = this.getMyJoinedMeals.bind(this);
    this.getMyLocation = this.getMyLocation.bind(this);
    this.getRequestConfig = this.getRequestConfig.bind(this);
    this.getUserSessionInfo = this.getUserSessionInfo.bind(this);
    this.pushJob = this.pushJob.bind(this);
    this.runJob = this.runJob.bind(this);
    this.toggleJoinMeal = this.toggleJoinMeal.bind(this);
    this.updateMeal = this.updateMeal.bind(this);
    this.updateMyLocation = this.updateMyLocation.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
    this.updatePaymentInfo = this.updatePaymentInfo.bind(this);

    this.pushJob(() => this.getMyHostedMeals());
    this.pushJob(() => this.getMyJoinedMeals());
  }

  private pushJob(job: any) {
    if (this._jobQueue.length == 0) {
      this.runJob(job);
    } else {
      this._jobQueue.push(job);
    }
  }

  private runJob(job: any) {
    job().then(() => {
      if (this._jobQueue.length > 0) {
        this.runJob(this._jobQueue.splice(0, 1));
      }
    });
  }

  private appendMealOwnerDetails(meal: Meal): Meal {
    if (this._userSessionInfo.isUserAuthenticated
      && meal.host.id == this._userSessionInfo.userIdentity.id) {
      meal.mine = true;
      meal.joined = false;
    }

    if (this._joinedMealsIdsList.indexOf(meal.id) > -1) {
      meal.joined = true;
    }

    return meal;
  }

  private getRequestConfig() {
    return {
        headers: { 'X-CSRFToken': this._csrfToken },
      };
  }

  getUserSessionInfo() : UserSessionInfo {
    return this._userSessionInfo;
  }

  getStripeKey() {
    return this._stripeKey;
  }

  updatePaymentInfo(stripeToken: string): Promise<ModelUpdateResult<string>> {
    return new Promise((resolve) => {
      this.pushJob(() => axios.put('/api/v1/users/me/payment-info', { stripe_token: stripeToken }, this.getRequestConfig()).then((res) => {
        resolve({
          modelOnServer: stripeToken,
          success: true,
          errorCode: ModelUpdateErrorCode.Success,
          errorString: ''
        });
      }));
    });
  }

  updateUserInfo(userInfo: Partial<UserIdentityUpdateModel>): Promise<ModelUpdateResult<UserIdentity>> {
    return new Promise<ModelUpdateResult<UserIdentity>>((resolve)=>{
      this.pushJob(() => axios.patch('/api/v1/users/me', userInfo, this.getRequestConfig()).then((response) => {
        let newUserIdentity : UserIdentity = response.data.data;
        this._userSessionInfo.userIdentity = newUserIdentity;

        resolve({
          modelOnServer: newUserIdentity,
          success: true,
          errorCode: ModelUpdateErrorCode.Success,
          errorString: ''
        });
      }));
    });
  }

  getLocationById(id: string): Promise<Location> {
    return new Promise<Location>((resolve) => {
      this.pushJob(() => axios.get('/api/v1/locations/' + id, this.getRequestConfig()).then((response) => {
        console.log(response);
      }));
    });
  }

  getMyLocation(): Promise<Location> {
    return new Promise<Location>((resolve)=>{});
  }

  updateMyLocation(location: Location): Promise<ModelUpdateResult<Location>> {
    return new Promise<ModelUpdateResult<Location>>((resolve)=>{});
  }

  getMealById(id: string): Promise<Meal> {
    return new Promise<Meal>((resolve, reject) => {
      this.pushJob(() => axios.get('/api/v1/meals/' + id, this.getRequestConfig()).then((response) => {
        let meal : Meal = response.data.data;
        resolve(this.appendMealOwnerDetails(meal));
      }).catch((reason) => {
        resolve(null); // TODO: Better error handling/unified request handling
      }));
    });
  }

  getMyJoinedMeals(): Promise<Meal[]> {
    return new Promise<Meal[]>((resolve, reject) => {
      this.pushJob(() => axios.get('/api/v1/meals/mine/guest', this.getRequestConfig()).then((response) => {
        let mealList : Meal[] = response.data.data;

        this._joinedMealsIdsList = [];

        mealList.forEach((meal) => {
          meal.joined = true;
          meal.mine = false;
          this._joinedMealsIdsList.push(meal.id);
        });

        resolve(mealList);
      }));
    });
  }

  getMyHostedMeals(): Promise<Meal[]> {
    return new Promise<Meal[]>((resolve, reject) => {
      this.pushJob(() => axios.get('/api/v1/meals/mine/host', this.getRequestConfig()).then((response) => {
        let mealList : Meal[] = response.data.data;

        mealList.forEach((meal) => {
          meal.joined = false;
          meal.mine = true;
        });

        resolve(mealList);
      }));
    });
  }

  filterMeals(filters: MealSearchFilter): Promise<Meal[]> {
    return new Promise<Meal[]>((resolve, reject) => {
      let params : any = {};

      switch(filters.mealTime) {
        case MealTime.Breakfast:
          params.meal = 'breakfast';
          break;
        case MealTime.Lunch:
          params.meal = 'lunch';
          break;
        case MealTime.Dinner:
          params.meal = 'dinner';
          break;
      }

      let requestConfig : any = this.getRequestConfig();
      requestConfig.params = params;
      this.pushJob(() => axios.get('/api/v1/meals/', requestConfig).then((response) => {
        let mealList : Meal[] = response.data.data;

        if (filters.textFilter.length > 0) {
          for(let filter of filters.textFilter) {
            let search = new fuse(mealList, {
              shouldSort: true,
              threshold:0.2,
              keys: [
                "name",
                "description",
                "host.public_name"
              ],
            });

            mealList = search.search(filter) as Meal[];
          }
        }

        mealList.forEach((meal) => {
          this.appendMealOwnerDetails(meal);
        });

        // Text filter
        resolve(mealList);
      }));
    });
  }

  deleteMeal(id: string): Promise<ModelUpdateResult<string>> {
    return new Promise<ModelUpdateResult<string>>((resolve) => {
      this.pushJob(() => axios.delete('/api/v1/meals/' + id, this.getRequestConfig()).then((response) => {
        resolve(<ModelUpdateResult<string>>{
          success: true,
          modelOnServer: id,
          errorCode: ModelUpdateErrorCode.Success,
          errorString: ''
        });
      }));
    });
  }

  toggleJoinMeal(id: string, join: boolean): Promise<ModelUpdateResult<Meal>> {
    if (join) {
      return new Promise<ModelUpdateResult<Meal>>((resolve)=>{
        this.pushJob(() => axios.post('/api/v1/meals/' + id + '/reservation', {}, this.getRequestConfig()).then((response) => {
          let newMeal : Meal = response.data.data;
          this._joinedMealsIdsList.push(id);
          resolve({
            modelOnServer: this.appendMealOwnerDetails(newMeal),
            success: true,
            errorCode: ModelUpdateErrorCode.Success,
            errorString: ''
          });
        }));
      });
    } else {
      return new Promise<ModelUpdateResult<Meal>>((resolve)=>{
        this.pushJob(() => axios.delete('/api/v1/meals/' + id + '/reservation', this.getRequestConfig()).then((response) => {
          let index = this._joinedMealsIdsList.indexOf(id);
          if (index > -1) {
            this._joinedMealsIdsList.splice(index, 1);
          }
          let newMeal : Meal = response.data.data;
          resolve({
            modelOnServer: this.appendMealOwnerDetails(newMeal),
            success: true,
            errorCode: ModelUpdateErrorCode.Success,
            errorString: ''
          });
        }));
      });
    }
  }

  updateMeal(meal: Partial<Meal>): Promise<ModelUpdateResult<Meal>> {
    return new Promise<ModelUpdateResult<Meal>>((resolve)=>{
      this.pushJob(() => axios.patch('/api/v1/meals/' + meal.id, meal, this.getRequestConfig()).then((response) => {
        let newMeal : Meal = response.data.data;
        resolve({
          modelOnServer: this.appendMealOwnerDetails(newMeal),
          success: true,
          errorCode: ModelUpdateErrorCode.Success,
          errorString: ''
        });
      }));
    });
  }

  createMeal(meal: Partial<Meal>): Promise<ModelUpdateResult<Meal>> {
    return new Promise<ModelUpdateResult<Meal>>((resolve) => {
      this.pushJob(() => axios.post('/api/v1/meals/', meal, this.getRequestConfig()).then((response) => {
        resolve(<ModelUpdateResult<Meal>>{
          success: true,
          modelOnServer: this.appendMealOwnerDetails(response.data.data),
          errorCode: ModelUpdateErrorCode.Success,
          errorString: ''
        });
      }));
    });
  }
}
