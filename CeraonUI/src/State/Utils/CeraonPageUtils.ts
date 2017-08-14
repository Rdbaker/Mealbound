import CeraonPage from '../CeraonPage';
import CeraonState from '../CeraonState';
import UrlProvider from '../../Services/UrlProvider';

export const CeraonPageToWindowTitle = {
};

CeraonPageToWindowTitle[CeraonPage.NotFound404] = () => {
  return 'Mealbound - Page Not Found';
}

CeraonPageToWindowTitle[CeraonPage.Home] = () => {
  return 'Mealbound';
}

CeraonPageToWindowTitle[CeraonPage.Loading] = () => {
  return 'Mealbound - Loading..';
}

CeraonPageToWindowTitle[CeraonPage.Search] = () => {
  return 'Mealbound - Find a Meal';
}

CeraonPageToWindowTitle[CeraonPage.ViewMeal] = () => {
  return 'Mealbound - View Meal';
}

CeraonPageToWindowTitle[CeraonPage.Landing] = () => {
  return 'Mealbound - Welcome';
}

CeraonPageToWindowTitle[CeraonPage.CreateMeal] = () => {
  return 'Mealbound - Host a Meal';
}

CeraonPageToWindowTitle[CeraonPage.EditMeal] = () => {
  return 'Mealbound - Modify a Meal';
}

CeraonPageToWindowTitle[CeraonPage.Settings] = () => {
  return 'Mealbound - Settings';
}

CeraonPageToWindowTitle[CeraonPage.NotAuthorized] = () => {
  return 'Mealbound';
}

export const CeraonPageToUrl = {
};

CeraonPageToUrl[CeraonPage.NotFound404] = () => {
  return UrlProvider.get404Url();
}

CeraonPageToUrl[CeraonPage.Home] = () => {
  return UrlProvider.getHomePageUrl();
}

CeraonPageToUrl[CeraonPage.Loading] = () => {
  return UrlProvider.getLoadingUrl();
}

CeraonPageToUrl[CeraonPage.Landing] = () => {
  return UrlProvider.getLandingUrl();
}

CeraonPageToUrl[CeraonPage.Search] = (appState: CeraonState) => {
  return UrlProvider.getSearchUrl(appState.searchPageState.filters); 
}

CeraonPageToUrl[CeraonPage.ViewMeal] = (appState: CeraonState) => {
  return UrlProvider.getViewMealUrl(appState.viewMealPageState.mealId);
}

CeraonPageToUrl[CeraonPage.CreateMeal] = () => {
  return UrlProvider.getCreateMealUrl();
}

CeraonPageToUrl[CeraonPage.EditMeal] = (appState: CeraonState) => {
  return UrlProvider.getEditMealUrl(appState.editMealPageState.mealId);
}

CeraonPageToUrl[CeraonPage.Settings] = () => {
  return UrlProvider.getSettingsUrl();
}

CeraonPageToUrl[CeraonPage.NotAuthorized] = () => {
  return UrlProvider.get403Url();
}
