import UserIdentity from './UserIdentity';

interface UserSessionInfo {
	isUserAuthenticated: boolean;
	sessionToken: string;
	sessionExpiryTime: number;
	userIdentity: UserIdentity; // userIdentity will only exist if isUserAuthentication == true
}

export default UserSessionInfo;