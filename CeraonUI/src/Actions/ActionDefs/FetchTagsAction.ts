import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';

export interface FetchTagsAction extends CeraonAction {
}

export function createFetchTagsAction() : FetchTagsAction {
  return {
    type: CeraonActionType.FetchTags,
  };
}
