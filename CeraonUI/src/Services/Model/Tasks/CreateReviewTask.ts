import { ICeraonModelAPI, ModelUpdateErrorCode, ModelUpdateResult } from '../../ICeraonModelAPI';
import CeraonModelAPI from '../../CeraonModelAPI';
import ModelTask from './ModelTask';
import Review from '../../../State/Meal/Review';
import * as Actions from '../../../Actions/Index';

export class CreateReviewTask extends ModelTask<ModelUpdateResult<Review>> {
  constructor(private _api: ICeraonModelAPI, private _review: Partial<Review>, startLoading: boolean) {
    super(startLoading);
  }

  run(next?: (task: ModelTask<ModelUpdateResult<Review>>, result: ModelUpdateResult<Review>)=>void) {
    this._api.createReview(this._review).then((result: ModelUpdateResult<Review>) => {
      this.dispatchAction(Actions.createReviewCreatedAction(result));
      if (next) {
        next(this, result);
      }
    });
  }
}
