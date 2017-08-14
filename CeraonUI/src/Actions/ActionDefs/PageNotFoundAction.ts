import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';

export interface PageNotFoundAction extends CeraonAction {
}

export function createPageNotFoundAction() : PageNotFoundAction {
  return {
    type: CeraonActionType.PageNotFound404,
  };
}
