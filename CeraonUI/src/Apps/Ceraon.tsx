import * as React from 'react';

import CeraonStore from '../Store/CeraonStore';
import CeraonState from '../State/CeraonState';
import NavigationBar from '../Components/NavigationBar';
import UserSessionProvider from '../Components/UserSessionProvider';

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
		return (
			<UserSessionProvider userSessionInfo={this.state.userSessionInfo}>
				<NavigationBar {...this.state.navigationBarState}/>
			</UserSessionProvider>
		)
	}

}