import * as React from 'react';
import {UserSessionProviderContext, UserSessionProviderContextTypes} from'./UserSessionProvider';
import UserSessionInfo from '../State/Identity/UserSessionInfo';

export default function UserSessionAware<Component, Props extends UserSessionAwareProps<Component>, ComponentState>(
	ComponentToWrap: new() => React.Component<Props, ComponentState>) {

	return class UserSessionAwareComponent extends React.Component<any, {}> {
		static contextTypes = UserSessionProviderContextTypes;
		context: UserSessionProviderContext;

		render() {
			return (
				<ComponentToWrap {...this.props} userSessionInfo={this.context.userSessionInfo} />
			);
		}
	}
}

export interface UserSessionAwareProps<T> extends React.Props<T> {
	userSessionInfo: UserSessionInfo;
}
