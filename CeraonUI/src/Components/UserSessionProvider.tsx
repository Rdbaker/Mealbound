import * as React from 'react';
import * as PropTypes from 'prop-types';
import UserSessionInfo from '../State/Identity/UserSessionInfo';

export interface UserSessionProviderProps extends React.Props<UserSessionProvider> {
	userSessionInfo: UserSessionInfo;
}

export interface UserSessionProviderContext {
	userSessionInfo: UserSessionInfo;
}

export const UserSessionProviderContextTypes = {
	userSessionInfo: PropTypes.object.isRequired
}

class UserSessionProvider extends React.Component<UserSessionProviderProps,{}> {
	static childContextTypes = UserSessionProviderContextTypes;

	constructor() {
		super();
	}

	getChildContext() : UserSessionProviderContext{
		return { userSessionInfo: this.props.userSessionInfo };
	}

	render() {
		return React.Children.only(this.props.children);
	}

}

export default UserSessionProvider;