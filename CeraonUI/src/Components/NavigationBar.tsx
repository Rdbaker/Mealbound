import * as React from 'react';
import {Menu, Input} from 'semantic-ui-react';
import UserSessionInfo from '../State/Identity/UserSessionInfo';
import NavigationBarState from '../State/NavigationBarState';

export interface NavigationBarProps extends React.Props<NavigationBar> {
	navigationBarState: NavigationBarState;
	userSessionInfo: UserSessionInfo;
}

export default class NavigationBar extends React.Component<NavigationBarProps, any> {
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
