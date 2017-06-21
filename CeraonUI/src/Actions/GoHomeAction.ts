import CeraonAction from './CeraonAction';
import CeraonActionType from './CeraonActionType';

export interface GoHomeAction extends CeraonAction {
}

export default function createGoHomeAction() : GoHomeAction {
  return {
    type: CeraonActionType.GoHome,
  };
}
