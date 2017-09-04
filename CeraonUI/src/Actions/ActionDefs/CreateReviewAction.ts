import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import Review from '../../State/Meal/Review';

export interface CreateReviewAction extends CeraonAction {
  review: Partial<Review>;
}

export function createCreateReviewAction(review: Partial<Review>) : CreateReviewAction {
  return {
    type: CeraonActionType.CreateReview,
    review: review,
  };
}
