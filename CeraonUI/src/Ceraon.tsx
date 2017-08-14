import * as React from 'react';

import AppHost from './Components/AppHost';
import CeraonPage from './State/CeraonPage';
import CeraonStore from './Store/CeraonStore';
import CeraonState from './State/CeraonState';
import HomePage from './Pages/HomePage';
import LandingPage from './Pages/LandingPage';
import LoadingPage from './Pages/LoadingPage';
import SearchPage from './Pages/SearchPage';
import ViewMealPage from './Pages/ViewMealPage';
import NotFound404Page from './Pages/NotFound404Page';
import NotAuthorizedPage from './Pages/NotAuthorizedPage';
import NavigationBar from './Components/NavigationBar';
import CreateMealPage from './Pages/CreateMealPage';
import EditMealPage from './Pages/EditMealPage';
import SettingsPage from './Pages/SettingsPage';

interface CeraonAppState extends CeraonState {
  navigationBarHeight: number;
}

export default class Ceraon extends React.Component<undefined, CeraonAppState> {
  constructor() {
    super();
    this.onStoreUpdate = this.onStoreUpdate.bind(this);
    this.onNavigationHeightChanged = this.onNavigationHeightChanged.bind(this);
    let state = CeraonStore.getState() as CeraonAppState;
    state.navigationBarHeight = 0;
    this.state = state;
    CeraonStore.subscribe(this.onStoreUpdate);
  }

  onStoreUpdate() {
    // TODO: Use react-redux
    let state = CeraonStore.getState() as CeraonAppState;
    state.navigationBarHeight = this.state.navigationBarHeight;
    this.setState(state);
  }

  onNavigationHeightChanged(newHeight: number) {
    this.setState({navigationBarHeight: newHeight});
  }

  render() {
    let appContent = (<div/>);

    switch (this.state.activePage) {
      case CeraonPage.NotFound404:
        appContent = <NotFound404Page/>
        break;
      case CeraonPage.Loading:
        appContent = <LoadingPage {...this.state.loadingPageState}/>
        break;
      case CeraonPage.Landing:
        appContent = <LandingPage {...this.state.landingPageState}/>
        break;
      case CeraonPage.Home:
        appContent = <HomePage {...this.state.homePageState}/>
        break;
      case CeraonPage.Search:
        appContent = <SearchPage {...this.state.searchPageState}/>
        break;
      case CeraonPage.ViewMeal:
        appContent = <ViewMealPage {...this.state.viewMealPageState}/>
        break;
      case CeraonPage.CreateMeal:
        appContent = <CreateMealPage {...this.state.createMealPageState}/>
        break;
      case CeraonPage.EditMeal:
        appContent = <EditMealPage {...this.state.editMealPageState}/>
        break;
      case CeraonPage.Settings:
        appContent = <SettingsPage {...this.state.userSessionInfo.userIdentity} { ...this.state.settingsPageState}/>
        break;
      case CeraonPage.NotAuthorized:
        appContent= <NotAuthorizedPage userSessionInfo={this.state.userSessionInfo}/>
        break;
    }

    return (
      <AppHost>
        <NavigationBar {...this.state.navigationBarState} onNavigationHeightChanged={this.onNavigationHeightChanged}/>
        <div className='app-content ui grid' style={{paddingTop: this.state.navigationBarHeight + 10}}>
          <div className='column'>
          { appContent }
          </div>
        </div>
      </AppHost>
    )
  }
}
