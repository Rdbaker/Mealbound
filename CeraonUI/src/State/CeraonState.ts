import UserSessionInfo, { defaultUserSessionInfo } from './Identity/UserSessionInfo';
import NavigationBarState, { defaultNavigationBarState } from './NavigationBarState';
import HomePageState, { defaultHomePageState } from './Pages/HomePageState';
import LoadingPageState, { defaultLoadingPageState } from './Pages/LoadingPageState';
import SearchPageState, { defaultSearchPageState } from './Pages/SearchPageState';
import ViewMealPageState, { defaultViewMealPageState } from './Pages/ViewMealPageState';
import EditMealPageState, { defaultEditMealPageState } from './Pages/EditMealPageState';
import CreateMealPageState, { defaultCreateMealPageState } from './Pages/CreateMealPageState';
import LandingPageState, { defaultLandingPageState } from './Pages/LandingPageState';
import SettingsPageState, { defaultSettingsPageState } from './Pages/SettingsPageState';

import CeraonPage from './CeraonPage';

interface CeraonState {
  userSessionInfo: UserSessionInfo;
  navigationBarState: NavigationBarState;
  loadingPageState: LoadingPageState;
  homePageState: HomePageState;
  searchPageState: SearchPageState;
  createMealPageState: CreateMealPageState;
  editMealPageState: EditMealPageState;
  viewMealPageState: ViewMealPageState;
  landingPageState: LandingPageState;
  settingsPageState: SettingsPageState;
  activePage: CeraonPage;
  pageTitle: string;
  pageUrl: string;
}

export const DEFAULT_CERAON_STATE: CeraonState = {
  userSessionInfo: defaultUserSessionInfo(),
  navigationBarState: defaultNavigationBarState(),
  loadingPageState: defaultLoadingPageState(),
  homePageState: defaultHomePageState(),
  searchPageState: defaultSearchPageState(),
  createMealPageState: defaultCreateMealPageState(),
  viewMealPageState: defaultViewMealPageState(),
  editMealPageState: defaultEditMealPageState(),
  landingPageState: defaultLandingPageState(),
  settingsPageState: defaultSettingsPageState(),
  activePage: CeraonPage.Home,
  pageTitle: '',
  pageUrl: '',
};

export default CeraonState;
