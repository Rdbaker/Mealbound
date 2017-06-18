import UserIdentity from './UserIdentity';

interface UserSessionInfo {
  isUserAuthenticated: boolean;
  sessionToken: string;
  sessionExpiryTime: number;
  userIdentity?: UserIdentity; // userIdentity will only exist if isUserAuthentication == true
}

export const DEFAULT_USER_SESSION_INFO: UserSessionInfo = {
  isUserAuthenticated: false,
  sessionToken: '',
  sessionExpiryTime: 0,
  userIdentity: null,
};

export default UserSessionInfo;
