import CeraonState from '../../State/CeraonState';
import CeraonAction from '../../Actions/CeraonAction';
import CeraonActionType from '../../Actions/CeraonActionType';
import CeraonPage from '../../State/CeraonPage';
import { MealSearchAction, MealSearchActionType } from '../../Actions/MealSearchAction';

import { DEFAULT_HOME_PAGE_STATE } from '../../State/Pages/HomePageState';
import { DEFAULT_LOADING_PAGE_STATE } from '../../State/Pages/LoadingPageState';
import { DEFAULT_SEARCH_PAGE_STATE } from '../../State/Pages/SearchPageState';

export default function ceraonReducer(state: CeraonState, action: CeraonAction) : CeraonState {

  switch (action.type) {
    case CeraonActionType.Login:
      return loginReducer(state, action);
    case CeraonActionType.MealSearch:
      return mealSearchReducer(state, action as MealSearchAction);
    case CeraonActionType.GoHome:
      return goHomeReducer(state);
  }

  return state;
}

function loginReducer(state: CeraonState, action: CeraonAction) : CeraonState {
  // TODO: Login will likely have to refresh the page because we are doing session-based auth
  const newState = resetOtherPageState(state, CeraonPage.Loading);
  newState.activePage = CeraonPage.Loading;
  newState.loadingPageState.loadingStatusMessage = 'Logging you in...';

  return newState;
}

function mealSearchReducer(state: CeraonState, action: MealSearchAction) : CeraonState {
  const newState = resetOtherPageState(state, CeraonPage.Search);
  newState.activePage = CeraonPage.Search;

  newState.navigationBarState.showSearchBox = false;

  if (action.searchActionType === MealSearchActionType.AddFilter) {
    newState.searchPageState.filters.push(action.filter);
  } else if (action.searchActionType === MealSearchActionType.RemoveFilter) {
    newState.searchPageState.filters = newState.searchPageState.filters.filter((filter) => {
      return !action.filter.equals(filter);
    });
  }

  const mockLocation = {
    name:'Mock Location',
    numDollarSigns: 5,
    rating: 4,
    latitude: 0,
    longitude: 0,
    address: '',
    phone: '',
  };

  newState.searchPageState.totalResults = 3;
  newState.searchPageState.currentResultsStartingIndex = 0;
  newState.searchPageState.results = [
    {
      name: 'Meal 1',
      description: 'Meal 1 description',
      scheduled_for: 0,
      price: 7.99,
      location: mockLocation,
    },
    {
      name: 'Meal 3',
      description: 'Meal 3 description',
      scheduled_for: 0,
      price: 3.99,
      location: mockLocation,
    },
    {
      name: 'Meal 2',
      description: 'Meal 2 description',
      scheduled_for: 0,
      price: 12.37,
      location: mockLocation,
    },
  ];


  return newState;
}

function goHomeReducer(state: CeraonState) : CeraonState {
  const newState = resetOtherPageState(state, CeraonPage.Home);

  newState.activePage = CeraonPage.Home;
  newState.navigationBarState.showSearchBox = true;

  return newState;
}

function resetOtherPageState(state: CeraonState, currentPage: CeraonPage) : CeraonState {
  const newState = state;

  if (currentPage !== CeraonPage.Home) {
    newState.homePageState = DEFAULT_HOME_PAGE_STATE;
  }

  if (currentPage !== CeraonPage.Loading) {
    newState.loadingPageState = DEFAULT_LOADING_PAGE_STATE;
  }

  if (currentPage !== CeraonPage.Search) {
    newState.searchPageState = DEFAULT_SEARCH_PAGE_STATE;
  }

  return newState;
}
