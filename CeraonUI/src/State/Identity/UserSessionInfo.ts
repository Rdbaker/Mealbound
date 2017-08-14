import UserIdentity from './UserIdentity';

interface UserSessionInfo {
  isUserAuthenticated: boolean;
  userIdentity?: UserIdentity; // userIdentity will only exist if isUserAuthentication == true
}

export function defaultUserSessionInfo(): UserSessionInfo {
  return {
    isUserAuthenticated: false,
    userIdentity: null,
  };
}

export default UserSessionInfo;
