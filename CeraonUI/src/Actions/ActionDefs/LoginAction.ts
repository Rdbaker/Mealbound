import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';

export interface LoginAction extends CeraonAction {
  email: string;
  password: string;
}

export function createLoginAction(email: string, password: string) : LoginAction {
  return {
    type: CeraonActionType.Login,
    email: email,
    password: password,
  };
}
