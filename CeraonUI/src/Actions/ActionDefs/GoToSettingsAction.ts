import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';

export interface GoToSettingsAction extends CeraonAction {
}

export function createGoToSettingsAction() : GoToSettingsAction {
  return {
    type: CeraonActionType.GoToSettings,
  };
}
