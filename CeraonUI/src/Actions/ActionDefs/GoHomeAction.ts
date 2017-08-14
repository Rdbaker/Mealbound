import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';

export interface GoHomeAction extends CeraonAction {
}

export function createGoHomeAction() : GoHomeAction {
  return {
    type: CeraonActionType.GoHome,
  };
}
