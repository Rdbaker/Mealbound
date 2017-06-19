import UserSessionInfo, { DEFAULT_USER_SESSION_INFO } from './Identity/UserSessionInfo';
import NavigationBarState, { DEFAULT_NAVIGATION_BAR_STATE } from './NavigationBarState';
import LoadingPageState, { DEFAULT_LOADING_PAGE_STATE } from './Pages/LoadingPageState';
import CeraonPage from './CeraonPage';

interface CeraonState {
  userSessionInfo: UserSessionInfo;
  navigationBarState: NavigationBarState;
  loadingPageState: LoadingPageState;
  activePage: CeraonPage;
}

export const DEFAULT_CERAON_STATE: CeraonState = {
  userSessionInfo: DEFAULT_USER_SESSION_INFO,
  navigationBarState: DEFAULT_NAVIGATION_BAR_STATE,
  loadingPageState: DEFAULT_LOADING_PAGE_STATE,
  activePage: CeraonPage.Home,
};

export default CeraonState;
