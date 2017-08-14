import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';

export interface LandingAction extends CeraonAction {
}

export function createLandingAction() : LandingAction {
  return {
    type: CeraonActionType.Landing,
  };
}
