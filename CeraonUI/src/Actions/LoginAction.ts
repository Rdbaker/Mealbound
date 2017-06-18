import CeraonAction from './CeraonAction';
import CeraonActionType from './CeraonActionType';

export interface LoginAction extends CeraonAction {
  username: string;
  password: string;
}

export default function createLoginAction(username: string, password: string) : LoginAction {
  return {
    type: CeraonActionType.Login,
    username: username,
    password: password
  }
}
