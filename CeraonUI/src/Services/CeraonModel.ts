import CeraonAction from '../Actions/CeraonAction';
import CeraonActionType from '../Actions/CeraonActionType';
import CeraonState from '../State/CeraonState';
import { ICeraonModelAPI, ModelUpdateResult } from './ICeraonModelAPI';
import CeraonModelAPI from './CeraonModelAPI';
import Meal from '../State/Meal/Meal';
import CeraonDispatcher from '../Store/CeraonDispatcher';
import MealSearchFilter from '../State/Meal/Filters/MealSearchFilter';
import CeraonPage from '../State/CeraonPage';
import UserSessionInfo from '../State/Identity/UserSessionInfo';
import * as Actions from '../Actions/Index';
import * as Tasks from './Model/Tasks/Index';

export class CeraonModel {
  private _cachedMeals: Meal[] = [];
  private _myCachedMeals: Array<Array<Meal>> = [];
  private _primaryTask : Tasks.ModelTask<any> = null;

  constructor(private _api: ICeraonModelAPI) {
  }

  getUserSessionInfo() : UserSessionInfo {
    return this._api.getUserSessionInfo();
  }

  getStripeKey() {
    return this._api.getStripeKey();
  }

  // Takes any relevant model actions based on the given action
  onAction(state: CeraonState, action: CeraonAction): void {
    switch (action.type) {
      case CeraonActionType.MealSearch:
        this.handleMealSearch(state.searchPageState.filters);
        break;
      case CeraonActionType.GoToEditMeal:
        this.handleLoadMeal((<Actions.GoToEditMealAction>action).mealId);
        break;
      case CeraonActionType.ViewMeal:
        this.handleLoadMeal((<Actions.ViewMealAction>action).mealId);
        break;
      case CeraonActionType.GoHome:
        this.handleGoHome(state);
        break;
      case CeraonActionType.UpdateMeal:
        this.handleUpdateMeal(state, action as Actions.UpdateMealAction);
        break;
      case CeraonActionType.LoadState:
        this.handleLoadState(state);
        break;
      case CeraonActionType.CancelMeal:
        this.handleCancelMeal(action as Actions.CancelMealAction);
        break;
      case CeraonActionType.UpdateUser:
        this.handleUpdateUser(action as Actions.UpdateUserAction);
        break;
      case CeraonActionType.CreateMeal:
        this.handleCreateMeal(action as Actions.CreateMealAction);
        break;
      case CeraonActionType.ToggleJoinMeal:
        this.handleToggleJoinMeal(action as Actions.ToggleJoinMealAction);
        break;
      case CeraonActionType.UpdatePaymentInfo:
        this.handleUpdatePaymentInfo(action as Actions.UpdatePaymentInfoAction);
        break;
    }
  }

  private handleMealSearch(filters: MealSearchFilter) {
    let searchTask = new Tasks.MealSearchTask(this._api, filters, true);
    this.runTask(true, searchTask, (task: Tasks.ModelTask<Meal[]>, result: Meal[]) => {
      this.cacheMeals(result);
    });
  }

  private handleLoadMeal(id: string) {
    for (let meal of this._cachedMeals) {
      if (meal.id == id) {
        // Found it already cached...
        CeraonDispatcher(Actions.createMealLoadedAction(meal));
        return;
      }
    }

    // Not cached, so lets load.
    let loadTask = new Tasks.MealLoadTask(this._api, id, true);
    this.runTask(true, loadTask, (task: Tasks.ModelTask<Meal>, result: Meal) => {
      this.cacheMeals([result]);
    });
  }

  private handleGoHome(state: CeraonState) {
    if (!state.userSessionInfo.isUserAuthenticated) {
      return;
    }

    let startLoading = true;
    if (this._myCachedMeals.length == 2) {
      CeraonDispatcher(Actions.createMyMealsLoadedAction(this._myCachedMeals[0], this._myCachedMeals[1]));
      startLoading = false;
    }

    // Refresh in case they've changed
    let loadTask = new Tasks.MyMealLoadTask(this._api, startLoading);
    this.runTask(true, loadTask, (task: Tasks.ModelTask<Array<Meal[]>>, result: Array<Meal[]>) => {
      this._myCachedMeals = result;
      this.cacheMeals(result[0]);
      this.cacheMeals(result[1]);
    });
  }

  private handleLoadState(state: CeraonState) {
    if (state.activePage == CeraonPage.ViewMeal) {
      this.handleLoadMeal(state.viewMealPageState.mealId);
    } else if (state.activePage == CeraonPage.Search) {
      this.handleMealSearch(state.searchPageState.filters);
    }
  }

  private handleUpdateMeal(state: CeraonState, action: Actions.UpdateMealAction) {
    let updateTask = new Tasks.UpdateMealTask(this._api, action.meal, false);
    this.runTask(false, updateTask, (task: Tasks.ModelTask<ModelUpdateResult<Meal>>, result: ModelUpdateResult<Meal>)=> {
      if (!result.success) {
        return;
      }

      let index = this._cachedMeals.findIndex((meal: Meal) => meal.id == result.modelOnServer.id);

      if (index > -1) {
        this._cachedMeals.splice(index, 1, result.modelOnServer);
      }

      if (this._myCachedMeals.length == 2) {
        index = this._myCachedMeals[0].findIndex((meal: Meal) => meal.id == result.modelOnServer.id);

        if (index > -1) {
          this._myCachedMeals[0].splice(index, 1, result.modelOnServer);
        }

        index = this._myCachedMeals[1].findIndex((meal: Meal) => meal.id == result.modelOnServer.id);

        if (index > -1) {
          if (!result.modelOnServer.joined) {
            this._myCachedMeals[1].splice(index, 1);
          } else {
            this._myCachedMeals[1].splice(index, 1, result.modelOnServer);
          }
        } else if (result.modelOnServer.joined) {
          this._myCachedMeals[1].push(result.modelOnServer);
        }
      }
    });
  }


  private handleCancelMeal(action: Actions.CancelMealAction) {
    let cancelTask = new Tasks.CancelMealTask(this._api, action.mealId, false);

    this.runTask(false, cancelTask, (task: Tasks.CancelMealTask, result: ModelUpdateResult<string>)=> {
      if (!result.success) {
        return;
      }

      let index = this._cachedMeals.findIndex((meal) => meal.id == result.modelOnServer);

      if (index > -1) {
        this._cachedMeals.splice(index, 1);
      }

      if (this._myCachedMeals.length == 2) {
        index = this._myCachedMeals[0].findIndex((meal) => meal.id == result.modelOnServer);
        if (index > -1) {
          this._myCachedMeals[0].splice(index, 1);
        }
        index = this._myCachedMeals[1].findIndex((meal) => meal.id == result.modelOnServer);
        if (index > -1) {
          this._myCachedMeals[1].splice(index, 1);
        }
      }
    });
  }

  private handleUpdateUser(action: Actions.UpdateUserAction) {
    let updateTask = new Tasks.UpdateUserTask(this._api, action.user, false);

    this.runTask(false, updateTask, ()=>{});
  }

  private handleCreateMeal(action: Actions.CreateMealAction) {
    let createTask = new Tasks.CreateMealTask(this._api, action.meal, true);

    this.runTask(true, createTask, ()=>{});
  }

  private handleToggleJoinMeal(action: Actions.ToggleJoinMealAction) {
    let toggleTask = new Tasks.ToggleJoinMealTask(this._api, action.id, action.join, action.stripeToken, false);
    this.runTask(false, toggleTask, (task: Tasks.ToggleJoinMealTask, result: ModelUpdateResult<Meal>) => {
      if (result.success) {
        if (result.modelOnServer.joined) {
          this._myCachedMeals[1].push(result.modelOnServer);
        } else {
          let index = this._myCachedMeals[1].findIndex((meal: Meal) => result.modelOnServer.id == meal.id);

          if (index > -1) {
            this._myCachedMeals[1].splice(index, 1);
          }
        }
      }
    });
  }

  private handleUpdatePaymentInfo(action: Actions.UpdatePaymentInfoAction) {
    let updateTask = new Tasks.UpdatePaymentInfoTask(this._api, action.stripeToken, true);
    this.runTask(true, updateTask, ()=>{});
  }


  private runTask<Result>(primary: boolean, task: Tasks.ModelTask<Result>, next: (task: Tasks.ModelTask<Result>, result: Result)=>void) {
    if (primary) {
      if (this._primaryTask) {
        this._primaryTask.cancel();
      }
      this._primaryTask = task;
    }

    task.run((task: Tasks.ModelTask<Result>, result: Result) => {
      if (this._primaryTask === task) {
        this._primaryTask = null;
      }

      next(task, result);
    });
  }

  private cacheMeals(meals: Meal[]) {
    for (let meal of meals) {
      if (!meal) {
        continue;
      }

      let index = this._cachedMeals.findIndex((otherMeal: Meal) => {
        return meal.id == otherMeal.id;
      });

      if (index > -1) {
        this._cachedMeals.splice(index, 1, meal);
      } else {
        this._cachedMeals.push(meal);
      }
    }
  }
}

export default new CeraonModel(new CeraonModelAPI());
