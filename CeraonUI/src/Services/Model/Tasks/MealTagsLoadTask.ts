import { ICeraonModelAPI, ModelUpdateErrorCode, ModelUpdateResult } from '../../ICeraonModelAPI';
import CeraonModelAPI from '../../CeraonModelAPI';
import ModelTask from './ModelTask';
import Tag from '../../../State/Meal/Tag';
import * as Actions from '../../../Actions/Index';

export class MealTagsLoadTask extends ModelTask<Tag[]> {
  constructor(private _api: ICeraonModelAPI, startLoading: boolean) {
    super(startLoading);
  }

  run(next?: (task: ModelTask<Tag[]>, result: Tag[])=>void) {
    this._api.getMealTags().then((tags: Tag[]) => {
      this.dispatchAction(Actions.createMealTagsLoadedAction(tags));
      if (next) {
        next(this, tags);
      }
    });
  }
}
