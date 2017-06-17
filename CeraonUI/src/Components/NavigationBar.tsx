import * as React from 'react';
import {Menu, Input} from 'semantic-ui-react';
import UserSessionInfo from '../State/Identity/UserSessionInfo';
import UserSessionAware, {UserSessionAwareProps} from './UserSessionAware';
import NavigationBarState from '../State/NavigationBarState';

export interface NavigationBarProps extends NavigationBarState, UserSessionAwareProps<NavigationBar> {

}

class NavigationBar extends React.Component<NavigationBarProps, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<Menu>
				<Menu.Item header>Ceraon</Menu.Item>
				<Menu.Item>
					<Input className="icon" icon="search" placeholder="Search..."/>
				</Menu.Item>
				<Menu.Item position="right">
					<Menu.Item>Create Account</Menu.Item>
				</Menu.Item>
			</Menu>
		)
	}
}

export default UserSessionAware<NavigationBar, NavigationBarProps, any>(NavigationBar);