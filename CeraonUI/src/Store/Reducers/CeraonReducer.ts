import CeraonState from '../../State/CeraonState';
import CeraonAction from '../../Actions/CeraonAction';
import CeraonActionType from '../../Actions/CeraonActionType';
import CeraonPage from '../../State/CeraonPage';
import * as CeraonPageUtils from '../../State/Utils/CeraonPageUtils';

import * as Actions from '../../Actions/Index';
import Meal from '../../State/Meal/Meal';

import { defaultHomePageState } from '../../State/Pages/HomePageState';
import { defaultLoadingPageState } from '../../State/Pages/LoadingPageState';
import { defaultLandingPageState } from '../../State/Pages/LandingPageState';
import { defaultSearchPageState } from '../../State/Pages/SearchPageState';
import { defaultViewMealPageState } from '../../State/Pages/ViewMealPageState';
import { defaultEditMealPageState } from '../../State/Pages/EditMealPageState';
import { defaultCreateMealPageState } from '../../State/Pages/CreateMealPageState';
import { defaultSettingsPageState } from '../../State/Pages/SettingsPageState';

import assert from '../../Utils/Assert';
import mixpanel from '../../Utils/Mixpanel';

export default function ceraonReducer(state: CeraonState, action: CeraonAction) : CeraonState {

  let stateCopy = Object.assign({}, state);

  switch (action.type) {
    case CeraonActionType.PageNotFound404:
      stateCopy = pageNotFoundReducer(stateCopy);
      break;
    case CeraonActionType.LoadState:
      stateCopy = loadStateReducer(stateCopy, action as Actions.LoadStateAction);
      break;
    case CeraonActionType.Login:
      stateCopy = loginReducer(stateCopy, action);
      break;
    case CeraonActionType.MealSearch:
      stateCopy = mealSearchReducer(stateCopy, action as Actions.MealSearchAction);
      break;
    case CeraonActionType.GoHome:
      stateCopy = goHomeReducer(stateCopy);
      break;
    case CeraonActionType.Landing:
      stateCopy = landingReducer(stateCopy);
      break;
    case CeraonActionType.ViewMeal:
      stateCopy = viewMealReducer(stateCopy, action as Actions.ViewMealAction);
      break;
    case CeraonActionType.StartLoading:
      stateCopy = startLoadingReducer(stateCopy);
      break;
    case CeraonActionType.MealLoaded:
      stateCopy = mealLoadedReducer(stateCopy, action as Actions.MealLoadedAction);
      break;
    case CeraonActionType.SearchResultsLoaded:
      stateCopy = searchResultsLoadedReducer(stateCopy, action as Actions.SearchResultsLoadedAction);
      break;
    case CeraonActionType.MyMealsLoaded:
      stateCopy = myMealsLoadedReducer(stateCopy, action as Actions.MyMealsLoadedAction);
      break;
    case CeraonActionType.UpdateMeal:
      stateCopy = updateMealReducer(stateCopy, action as Actions.UpdateMealAction);
      break;
    case CeraonActionType.MealUpdated:
      stateCopy = mealUpdatedReducer(stateCopy, action as Actions.MealUpdatedAction);
      break;
    case CeraonActionType.CancelMeal:
      stateCopy = cancelMealReducer(stateCopy, action as Actions.CancelMealAction);
      break;
    case CeraonActionType.MealCancelled:
      stateCopy = mealCancelledReducer(stateCopy, action as Actions.MealCancelledAction);
      break;
    case CeraonActionType.GoToCreateMeal:
      stateCopy = goToCreateMealReducer(stateCopy);
      break;
    case CeraonActionType.GoToSettings:
      stateCopy = goToSettingsReducer(stateCopy);
      break;
    case CeraonActionType.GoToEditMeal:
      stateCopy = goToEditMealReducer(stateCopy, action as Actions.GoToEditMealAction);
      break;
    case CeraonActionType.NotAuthorized:
      stateCopy = notAuthorizedReducer(stateCopy);
      break;
    case CeraonActionType.UpdateUser:
      stateCopy = updateUserReducer(stateCopy);
      break;
    case CeraonActionType.UserUpdated:
      stateCopy = userUpdatedReducer(stateCopy, action as Actions.UserUpdatedAction);
      break;
    case CeraonActionType.MealCreated:
      stateCopy = mealCreatedReducer(stateCopy, action as Actions.MealCreatedAction);
      break;
    case CeraonActionType.ToggleJoinMeal:
      stateCopy = toggleJoinedMealReducer(stateCopy);
      break;
    case CeraonActionType.CreateReview:
      stateCopy = createReviewReducer(stateCopy, action as Actions.CreateReviewAction);
      break;
    case CeraonActionType.ReviewCreated:
      stateCopy = reviewCreatedReducer(stateCopy, action as Actions.ReviewCreatedAction);
      break;
  }

  stateCopy.pageUrl = CeraonPageUtils.CeraonPageToUrl[stateCopy.activePage](stateCopy);
  stateCopy.pageTitle = CeraonPageUtils.CeraonPageToWindowTitle[stateCopy.activePage](stateCopy);

  stateCopy = navigationBarStateReducer(stateCopy);

  return stateCopy;
}

function navigationBarStateReducer(state: CeraonState): CeraonState {
  if (state.activePage == CeraonPage.Search || state.activePage == CeraonPage.Landing) {
    state.navigationBarState.showSearchBox = false;
  } else {
    state.navigationBarState.showSearchBox = true;
  }

  state.navigationBarState.showLoginAndCreateAccountButton = !state.userSessionInfo.isUserAuthenticated;
  state.navigationBarState.showSettingsDropdown = state.userSessionInfo.isUserAuthenticated;

  return state;
}

function loadStateReducer(state: CeraonState, action: Actions.LoadStateAction) : CeraonState {
  return action.state;
}

function pageNotFoundReducer(state: CeraonState) : CeraonState {
    const newState = resetOtherPageState(state, CeraonPage.NotFound404);
    newState.activePage = CeraonPage.NotFound404;

    return newState;
}

function loginReducer(state: CeraonState, action: CeraonAction) : CeraonState {
  // TODO: Login will likely have to refresh the page because we are doing session-based auth
  const newState = resetOtherPageState(state, CeraonPage.Loading);
  newState.activePage = CeraonPage.Loading;
  newState.loadingPageState.loadingStatusMessage = 'Logging you in...';

  return newState;
}

function mealSearchReducer(state: CeraonState, action: Actions.MealSearchAction) : CeraonState {
  mixpanel.track('Meal Search', action);
  const newState = resetOtherPageState(state, CeraonPage.Search);
  newState.activePage = CeraonPage.Search;

  newState.searchPageState.currentResultsStartingIndex = 0;
  newState.searchPageState.totalResults = 0;
  newState.searchPageState.results = [];
  newState.searchPageState.filters = action.filter;

  return newState;
}

function goHomeReducer(state: CeraonState) : CeraonState {
  // the user should only be able to "go home" if they are authenticated.
  // Otherwise, they should hit the landing page
  if (state.userSessionInfo.isUserAuthenticated) {
    const newState = resetOtherPageState(state, CeraonPage.Home);

    newState.activePage = CeraonPage.Home;

    newState.homePageState.myHostedMeals = [];
    newState.homePageState.myJoinedMeals = [];
    newState.homePageState.myMealInfoLoading = false;
    newState.homePageState.showMyMealInfo = newState.userSessionInfo.isUserAuthenticated;

    return newState;
  } else {
    return landingReducer(state);
  }
}

function landingReducer(state: CeraonState) : CeraonState {
  const newState = resetOtherPageState(state, CeraonPage.Landing);

  newState.activePage = CeraonPage.Landing;

  return newState;
}

function viewMealReducer(state: CeraonState, action: Actions.ViewMealAction) : CeraonState {
  mixpanel.track('View Meal', action);
  const newState = resetOtherPageState(state, CeraonPage.ViewMeal);

  newState.activePage = CeraonPage.ViewMeal;
  newState.viewMealPageState.showUserLoginPrompt = !newState.userSessionInfo.isUserAuthenticated;
  newState.viewMealPageState.mealId = action.mealId;
  newState.viewMealPageState.failedToFindMeal = false;

  return newState;
}

function startLoadingReducer(state: CeraonState) : CeraonState {
  if (state.activePage == CeraonPage.ViewMeal) {
    state.viewMealPageState.isLoading = true;
  } else if (state.activePage == CeraonPage.Search) {
    state.searchPageState.isLoading = true;
  } else if (state.activePage == CeraonPage.Home) {
    state.homePageState.myMealInfoLoading = true;
  } else if (state.activePage == CeraonPage.CreateMeal) {
    state.createMealPageState.isCreateLoading = true;
  } else if (state.activePage == CeraonPage.EditMeal) {
    state.editMealPageState.mealLoading = true;
  }

  return state;
}

function mealLoadedReducer(state: CeraonState, action: Actions.MealLoadedAction) : CeraonState {

  if (state.activePage == CeraonPage.ViewMeal) {
    if (!action.meal) {
      state.viewMealPageState.isLoading = false;
      state.viewMealPageState.failedToFindMeal = true;
    } else if (state.viewMealPageState.mealId == action.meal.id) {
      state.viewMealPageState.isLoading = false;
      state.viewMealPageState.meal = action.meal;
    }
  } else if (state.activePage == CeraonPage.EditMeal) {
    state.editMealPageState.mealLoading = false;

    if (!action.meal) {
      state.editMealPageState.failedToFindMeal = true;
    } else {
      state.editMealPageState.meal = action.meal;
    }
  }

  return state;
}

function searchResultsLoadedReducer(state: CeraonState, action: Actions.SearchResultsLoadedAction) : CeraonState {

  if (state.activePage == CeraonPage.Search) {
    state.searchPageState.results = action.meals;
    state.searchPageState.totalResults = action.meals.length;
    state.searchPageState.currentResultsStartingIndex = 0;
    state.searchPageState.isLoading = false;
  }

  return state;
}

function myMealsLoadedReducer(state: CeraonState, action: Actions.MyMealsLoadedAction) : CeraonState {
  assert(state.userSessionInfo.isUserAuthenticated,
    'User should be authenticated before we attempt to load their meals');

  if (state.activePage == CeraonPage.Home) {
    state.homePageState.myHostedMeals = action.hostedMeals;
    state.homePageState.myJoinedMeals = action.joinedMeals;
    state.homePageState.myMealInfoLoading = false;
  }

  return state;
}

function updateMealReducer(state: CeraonState, action: Actions.UpdateMealAction) : CeraonState {

  if (state.activePage == CeraonPage.ViewMeal) {
    if (state.viewMealPageState.meal.joined != action.meal.joined) {
      state.viewMealPageState.isToggleJoinPending = true;
    }
  }

  return state;
}

function toggleJoinedMealReducer(state: CeraonState) : CeraonState {

  if (state.activePage == CeraonPage.ViewMeal) {
    state.viewMealPageState.isToggleJoinPending = true;
  }

  return state;
}

function mealUpdatedReducer(state: CeraonState, action: Actions.MealUpdatedAction) : CeraonState {
  mixpanel.track('Meal Updated', action);

  // TODO: Show errors here
  if (state.activePage == CeraonPage.ViewMeal
    && action.meal.modelOnServer.id == state.viewMealPageState.mealId) {
    state.viewMealPageState.meal = action.meal.modelOnServer;
    state.viewMealPageState.isToggleJoinPending = false;
  } else if (state.activePage == CeraonPage.Search) {
    let index = state.searchPageState.results.findIndex((meal: Meal) => meal.id == action.meal.modelOnServer.id);

    if (index > -1) {
      state.searchPageState.results.splice(index, 1, action.meal.modelOnServer);
    }
  } else if (state.activePage == CeraonPage.Home) {
    let index = state.homePageState.myHostedMeals.findIndex((meal: Meal) => meal.id == action.meal.modelOnServer.id);

    if (index > -1) {
      state.homePageState.myHostedMeals.splice(index, 1, action.meal.modelOnServer);
    }

    index = state.homePageState.myJoinedMeals.findIndex((meal: Meal) => meal.id == action.meal.modelOnServer.id);
    if (index > -1) {
      state.homePageState.myJoinedMeals.splice(index, 1, action.meal.modelOnServer);
    }
  }

  return state;
}

function cancelMealReducer(state: CeraonState, action: Actions.CancelMealAction) : CeraonState {
  assert(state.activePage == CeraonPage.ViewMeal, 'This action can only be dispatched from the view meal page');
  state.viewMealPageState.isCancelPending = true;
  return state;
}

function mealCancelledReducer(state: CeraonState, action: Actions.MealCancelledAction) : CeraonState {
  mixpanel.track('Meal Cancel', action);
  if (state.activePage == CeraonPage.ViewMeal && state.viewMealPageState.mealId == action.mealId.modelOnServer) {
    state.viewMealPageState.meal = null;
    state.viewMealPageState.isCancelPending = false;
  }

  return state;
}

function goToCreateMealReducer(state: CeraonState) : CeraonState {

  if (state.userSessionInfo.isUserAuthenticated) {
    const newState = resetOtherPageState(state, CeraonPage.CreateMeal);

    newState.activePage = CeraonPage.CreateMeal;
    newState.createMealPageState.isUserUpdateLoading = false;
    newState.createMealPageState.showAddLocationPrompt = !newState.userSessionInfo.isUserAuthenticated
      || !newState.userSessionInfo.userIdentity.address || newState.userSessionInfo.userIdentity.address.length == 0;

    newState.createMealPageState.isCreateLoading = false;

    return newState;
  } else {
    return notAuthorizedReducer(state);
  }
}

function goToSettingsReducer(state: CeraonState) : CeraonState {
  if (state.userSessionInfo.isUserAuthenticated) {
    const newState = resetOtherPageState(state, CeraonPage.Settings);
    newState.activePage = CeraonPage.Settings;
    newState.settingsPageState.isUpdating = false;
    return newState;
  } else {
    return notAuthorizedReducer(state);
  }
}

function goToEditMealReducer(state: CeraonState, action: Actions.GoToEditMealAction) : CeraonState {
  if (state.userSessionInfo.isUserAuthenticated) {
    const newState = resetOtherPageState(state, CeraonPage.EditMeal);

    newState.activePage = CeraonPage.EditMeal;
    newState.editMealPageState.mealId = action.mealId;
    newState.editMealPageState.meal = null;
    newState.editMealPageState.mealLoading = false;

    return newState;
  } else {
    return notAuthorizedReducer(state);
  }
}

function notAuthorizedReducer(state: CeraonState) : CeraonState {
    const newState = resetOtherPageState(state, CeraonPage.NotAuthorized);

    newState.activePage = CeraonPage.NotAuthorized;

    return newState;
}

function updateUserReducer(state: CeraonState) : CeraonState {
  if (state.activePage == CeraonPage.CreateMeal) {
    state.createMealPageState.isUserUpdateLoading = true;
  } else if (state.activePage == CeraonPage.Settings) {
    state.settingsPageState.isUpdating = true;
  }

  return state;
}

function userUpdatedReducer(state: CeraonState, action: Actions.UserUpdatedAction) : CeraonState {
  mixpanel.track('User Settings Updated', action);

  // TODO: handle errors
  if (action.user.success) {
    state.userSessionInfo.userIdentity = action.user.modelOnServer;

    if (state.activePage == CeraonPage.CreateMeal) {
      state.createMealPageState.isUserUpdateLoading = false;
      state.createMealPageState.showAddLocationPrompt = !state.userSessionInfo.isUserAuthenticated
        || !state.userSessionInfo.userIdentity.address || state.userSessionInfo.userIdentity.address.length == 0;
    } else if (state.activePage == CeraonPage.Settings) {
      state.settingsPageState.isUpdating = false;
      state.settingsPageState.updatedMessage = 'Profile saved';
    }
  }

  return state;
}

function mealCreatedReducer(state: CeraonState, action: Actions.MealCreatedAction) : CeraonState {
  mixpanel.track('Meal Created', action);
  if (action.meal.success) {
    if (state.activePage == CeraonPage.CreateMeal) {
      state.createMealPageState.isCreateLoading = false;
    }
  }

  return state;
}

function createReviewReducer(state: CeraonState, action: Actions.CreateReviewAction) : CeraonState {
  state.viewMealPageState.isReviewCreatePending = true;

  return state;
}

function reviewCreatedReducer(state: CeraonState, action: Actions.ReviewCreatedAction) : CeraonState {
  state.viewMealPageState.isReviewCreatePending = false;
  state.viewMealPageState.isReviewCreateSuccess = true;

  return state;
}

function resetOtherPageState(state: CeraonState, currentPage: CeraonPage) : CeraonState {
  const newState = state;

  if (currentPage !== CeraonPage.Home) {
    newState.homePageState = defaultHomePageState();
  }

  if (currentPage !== CeraonPage.Loading) {
    newState.loadingPageState = defaultLoadingPageState();
  }

  if (currentPage !== CeraonPage.Search) {
    newState.searchPageState = defaultSearchPageState();
  }

  if (currentPage !== CeraonPage.Landing) {
    newState.landingPageState = defaultLandingPageState();
  }

  if (currentPage !== CeraonPage.EditMeal) {
    newState.editMealPageState = defaultEditMealPageState();
  }

  if (currentPage !== CeraonPage.ViewMeal) {
    newState.viewMealPageState = defaultViewMealPageState();
  }

  if (currentPage !== CeraonPage.CreateMeal) {
    newState.createMealPageState = defaultCreateMealPageState();
  }

  if (currentPage !== CeraonPage.Settings) {
    newState.settingsPageState = defaultSettingsPageState();
  }

  return newState;
}
