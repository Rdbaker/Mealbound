import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import Tag from '../../State/Meal/Tag';

export interface MealTagsLoadedAction extends CeraonAction {
  tags: Tag[];
}

export function createMealTagsLoadedAction(tags: Tag[]) : MealTagsLoadedAction {
  return {
    type: CeraonActionType.MealTagsLoaded,
    tags: tags,
  };
}
