import * as React from 'react';

import AppHost from './Components/AppHost';
import CeraonPage from './State/CeraonPage';
import CeraonStore from './Store/CeraonStore';
import CeraonState from './State/CeraonState';
import LoadingPage from './Apps/LoadingPage';
import NavigationBar from './Components/NavigationBar';

export default class Ceraon extends React.Component<{}, CeraonState> {
  constructor() {
    super();

    this.onStoreUpdate = this.onStoreUpdate.bind(this);
    this.state = CeraonStore.getState();
    CeraonStore.subscribe(this.onStoreUpdate);
  }

  onStoreUpdate() {
    this.setState(CeraonStore.getState());
  }

  render() {
    let appContent = (<div/>);

    switch (this.state.activePage) {
      case CeraonPage.Loading:
        appContent = <LoadingPage {...this.state.loadingPageState}/>
        break;
      case CeraonPage.Home:
      appContent = <div>Hello World</div>
    }

    return (
      <AppHost>
        <NavigationBar {...this.state.navigationBarState}/>
        <div className='app-content'>
          { appContent }
        </div>
      </AppHost>
    )
  }

}