import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import Review from '../../State/Meal/Review';
import { ModelUpdateResult } from '../../Services/ICeraonModelAPI';

export interface ReviewCreatedAction extends CeraonAction {
  review: ModelUpdateResult<Review>;
}

export function createReviewCreatedAction(review: ModelUpdateResult<Review>) : ReviewCreatedAction {
  return {
    type: CeraonActionType.ReviewCreated,
    review: review,
  };
}
