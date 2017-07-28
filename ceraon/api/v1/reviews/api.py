# -*- encoding: utf-8 -*-
"""API routes for reviews."""

from flask import jsonify, request
from flask_login import current_user, login_required

from ceraon.api.v1.meals.api import blueprint as meal_api
from ceraon.constants import Errors, Success
from ceraon.errors import BadRequest, Forbidden, NotFound, PreconditionRequired
from ceraon.models.meals import Meal, UserMeal
from ceraon.models.reviews import Review
from ceraon.utils import RESTBlueprint, friendly_arg_get

from .schema import ReviewSchema

blueprint = RESTBlueprint('reviews', __name__, version='v1')

REVIEW_SCHEMA = ReviewSchema(exclude=ReviewSchema.private_fields)
PRIVATE_REVIEW_SCHEMA = ReviewSchema()


def get_meal_from_query_params():
    """Get the meal from the meal_id in the query params.

    returns None if no review was found or if there was no meal_id in the
    request
    """
    meal_id = request.args.get('meal_id')
    if meal_id is None:
        return None
    else:
        return Meal.find(meal_id)


def update_or_replace_review(review_id, data, replace=False):
    """Update or replace a review based on the data being passed in.

    :param review_id str: a hex string of the UUID
    :param data dict: a dict of the data to use to update/replace the meal
    :param replace bool: (default: False) whether to replace the meal or update
        the meal. This affects only a couple things.

    :return dict: the new meal data as a dict
    """
    review = Review.find(review_id)
    if review is None:
        raise NotFound(Errors.REVIEW_NOT_FOUND)
    if current_user.id != review.user_id:
        raise Forbidden(Errors.NOT_YOUR_REVIEW)
    # we want to indicate the data is "partial" if we are *not* replacing.
    # i.e. we are updating
    review_data = REVIEW_SCHEMA.load(request.json, partial=(not replace)).data
    review.update(**review_data)
    return REVIEW_SCHEMA.dump(review).data


@blueprint.find(converter='uuid')
def find_review(uid):
    """Find a review from it's PK."""
    review = Review.find(uid)
    if review is None:
        raise NotFound(Errors.REVIEW_NOT_FOUND)
    return jsonify(data=REVIEW_SCHEMA.dump(review).data)


@meal_api.flexible_route('/<uuid:meal_id>/reviews', methods=['GET'])
def list_meal_reviews(meal_id):
    """List the reviews for a given meal."""
    page_num = friendly_arg_get('page', 1, int)
    per_page = friendly_arg_get('per_page', 10, int)
    meal = Meal.find(meal_id)
    if meal is None:
        raise NotFound(Errors.MEAL_NOT_FOUND)
    page = Review.query.filter(meal_id=meal_id).paginate(page=page_num,
                                                         per_page=per_page)
    base_url = request.path + '?meal_id={}'.format(meal_id)
    meta_pagination = {
        'first': base_url + '&page={page}&per_page={per_page}'.format(
            page=1, per_page=page.per_page),
        'next': base_url + '&page={page}&per_page={per_page}'.format(
            page=page.next_num, per_page=page.per_page),
        'last': base_url + '&page={page}&per_page={per_page}'.format(
            page=page.pages or 1, per_page=page.per_page),
        'prev': base_url + '&page={page}&per_page={per_page}'.format(
            page=page.prev_num, per_page=page.per_page),
        'total': page.pages
    }

    if not page.has_next:
        meta_pagination.pop('next')
    if not page.has_prev:
        meta_pagination.pop('prev')

    return jsonify(data=REVIEW_SCHEMA.dump(page.items, many=True).data,
                   meta={'pagination': meta_pagination})


@blueprint.list()
def list_reviews():
    """List reviews for a meal.

    NOTE: for this endpoint, you MUST specify a query param of meal_id=<id>
    """
    meal = get_meal_from_query_params()
    if meal is None:
        raise NotFound(Errors.MEAL_NOT_FOUND)
    return list_meal_reviews(meal.id)


@meal_api.flexible_route('/<uuid:meal_id>/reviews', methods=['POST'])
@login_required
def create_review_from_meal_id(meal_id):
    """Create a new review given a meal ID."""
    meal = Meal.find(meal_id)
    if meal is None:
        raise NotFound(Errors.MEAL_NOT_FOUND)
    if meal.is_upcoming():
        raise PreconditionRequired(Errors.REVIEW_IN_FUTURE)
    user_meal = UserMeal.query.get((current_user.id, meal.id))
    if user_meal is None:
        raise Forbidden(Errors.REVIEW_NONJOINED_MEAL)
    review_data = REVIEW_SCHEMA.load(request.json).data
    review = Review.create(meal_id=meal.id, user_id=current_user.id,
                           **review_data)
    return jsonify(data=REVIEW_SCHEMA.dump(review).data,
                   message=Success.REVIEW_CREATED), 201


@blueprint.create()
@login_required
def create_review():
    """Create a new review.

    NOTE: for this endpoint, you MUST specify a query param of meal_id=<id>
    """
    meal = get_meal_from_query_params()
    if meal is None:
        raise NotFound(Errors.MEAL_NOT_FOUND)
    return create_review_from_meal_id(meal.id)


@blueprint.update()
@login_required
def update_meal(uid):
    """Update a review."""
    return jsonify(data=update_or_replace_review(uid, request.json, False),
                   message=Success.REVIEW_UPDATED), 200


@blueprint.replace()
@login_required
def replace_meal(uid):
    """Replace a review."""
    return jsonify(data=update_or_replace_review(uid, request.json, True),
                   message=Success.REVIEW_UPDATED), 200


@blueprint.destroy()
@login_required
def destroy_review(uid):
    """Destroy a review."""
    review = Review.find(uid)
    if review is None:
        raise NotFound(Errors.REVIEW_NOT_FOUND)
    if current_user.id != review.user_id:
        raise Forbidden(Errors.NOT_YOUR_MEAL)
    review.delete()
    return jsonify(data=None, message=Success.REVIEW_DELETED), 204


@blueprint.flexible_route('/mine/<string:role>')
@login_required
def get_user_reviews(role):
    """Get a user's reviews based on their role in the meal.

    :param role string: `role` can be either: 'guest', or 'host'

    a `role` of "guest" will return all the reviews for the joined meals written
        by the user.
    a `role` of "host" will return all the reviews for the hosted meals.
    """
    valid_roles = set(['guest', 'host'])
    if role not in valid_roles:
        raise BadRequest(Errors.INVALID_MEAL_ROLE)
    if role == 'guest':
        reviews = Review.query.filter_by(user_id=current_user.id)
        schema = PRIVATE_REVIEW_SCHEMA
    else:
        reviews = current_user.get_reviews_as_subject()
        schema = REVIEW_SCHEMA
    return jsonify(data=schema.dump(reviews, many=True).data)
