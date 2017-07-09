"""API routes for meals."""

from datetime import datetime as dt

from flask import jsonify, request
from flask_login import current_user, login_required
from sqlalchemy.exc import IntegrityError

from ceraon.constants import Errors, Success
from ceraon.errors import (BadRequest, Conflict, Forbidden, NotFound,
                           PreconditionRequired)
from ceraon.models.meals import Meal, UserMeal
from ceraon.utils import RESTBlueprint, friendly_arg_get

from .schema import MealSchema

blueprint = RESTBlueprint('meals', __name__, version='v1')

MEAL_SCHEMA = MealSchema(exclude=MealSchema.private_fields)
PRIVATE_MEAL_SCHEMA = MealSchema()


def update_or_replace_meal(meal_id, data, replace=False):
    """Update or replace a meal based on the data being passed in.

    :param meal_id str: a hex string of the UUID
    :param data dict: a dict of the data to use to update/replace the meal
    :param replace bool: (default: False) whether to replace the meal or update
        the meal. This affects only a couple things.

    :return dict: the new meal data as a dict
    """
    if current_user.location is None:
        raise PreconditionRequired(Errors.LOCATION_NOT_CREATED_YET)
    meal = Meal.find(meal_id)
    if meal is None:
        raise NotFound(Errors.MEAL_NOT_FOUND)
    if current_user.id != meal.host.id:
        raise Forbidden(Errors.NOT_YOUR_MEAL)
    # we want to indicate the data is "partial" if we are *not* replacing.
    # i.e. we are updating
    meal_data = MEAL_SCHEMA.load(request.json, partial=(not replace)).data
    meal.update(**meal_data)
    return MEAL_SCHEMA.dump(meal).data


@blueprint.find()
def find_meal(uid):
    """
    Find a meal from it's UUID.

    ---
    tags:
      - meals
    definitions:
      - schema:
          id: Meal
          properties:
            id:
             type: integer
             description: the meal's UUID as a string
            name:
             type: string
             description: the name of the meal
            description:
             type: string
             description: the description of the meal
            price:
             type: number
             format: float
             description: the cost of the meal
            host:
             schema:
               id: User
               properties:
                 first_name:
                   type: string
                 last_name:
                   type: string
                 public_name:
                   type: string
                 image_url:
                   type: string
                 created_at:
                   type: string
                   format: date-time
                 id:
                   type: integer
             description: the last name of the user
    parameters:
      - in: path
        name: uid
        description: The meal's id
        required: true
    responses:
      200:
        description: Meal data found
        schema:
          id: Meal
      404:
        description: The meal could not be found
    """
    meal = Meal.find(uid)
    if meal is None:
        raise NotFound(Errors.MEAL_NOT_FOUND)
    return jsonify(data=MEAL_SCHEMA.dump(meal).data)


@blueprint.list()
def list_meals():
    """
    Search for a meal based on search parameters.

    ---
    tags:
     - meals
    parameters:
     - in: query
       name: page
       description: the page of the meals to retrieve
       default: 1
     - in: query
       name: per_page
       description: the number of results to return per page
       default: 10
     - in: query
       name: meal
       description: the meal of day that should be returned
       enum:
         - breakfast
         - lunch
         - dinner
    responses:
      200:
        description: Meal data found
        schema:
          type: array
          items:
            schema:
              id: Meal
    """
    page_num = friendly_arg_get('page', 1, int)
    per_page = friendly_arg_get('per_page', 10, int)
    requested_meal = request.args.get('meal')
    if requested_meal == 'breakfast':
        query = Meal.breakfast()
    elif requested_meal == 'lunch':
        query = Meal.lunch()
    elif requested_meal == 'dinner':
        query = Meal.dinner()
    else:
        query = Meal.query
    page = Meal.upcoming_filter(query).order_by(Meal.scheduled_for)\
        .paginate(page=page_num, per_page=per_page)

    meta_pagination = {
        'first': request.path + '?page={page}&per_page={per_page}'.format(
            page=1, per_page=page.per_page),
        'next': request.path + '?page={page}&per_page={per_page}'.format(
            page=page.next_num, per_page=page.per_page),
        'last': request.path + '?page={page}&per_page={per_page}'.format(
            page=page.pages or 1, per_page=page.per_page),
        'prev': request.path + '?page={page}&per_page={per_page}'.format(
            page=page.prev_num, per_page=page.per_page),
        'total': page.pages
    }

    if not page.has_next:
        meta_pagination.pop('next')
    if not page.has_prev:
        meta_pagination.pop('prev')

    return jsonify(data=MEAL_SCHEMA.dump(page.items, many=True).data,
                   meta={'pagination': meta_pagination})


@blueprint.create()
@login_required
def create_meal():
    """Create a new meal."""
    if current_user.location is None:
        raise PreconditionRequired(Errors.LOCATION_NOT_CREATED_YET)
    meal_data = MEAL_SCHEMA.load(request.json).data
    meal = Meal.create(location_id=current_user.location.id, **meal_data)
    return jsonify(data=MEAL_SCHEMA.dump(meal).data,
                   message=Success.MEAL_CREATED), 201


@blueprint.flexible_route('/<string:uid>/reservation', methods=['POST'])
@login_required
def join_meal(uid):
    """Join a meal."""
    meal = Meal.find(uid)
    if meal is None:
        raise NotFound(Errors.MEAL_NOT_FOUND)
    if meal.scheduled_for < dt.now().astimezone():
        raise BadRequest(Errors.MEAL_ALREADY_HAPPENED)
    if meal.host.id == current_user.id:
        raise BadRequest(Errors.JOIN_HOSTED_MEAL)
    # TODO: do some validation here for payment processing
    try:
        UserMeal.create(meal=meal, user=current_user)
    except IntegrityError:
        # an integrity error means that the user already joined the meal
        raise Conflict(Errors.MEAL_ALREADY_JOINED)
    return jsonify(data=MEAL_SCHEMA.dump(meal).data,
                   message=Success.MEAL_WAS_JOINED), 201


@blueprint.flexible_route('/<string:uid>/reservation', methods=['DELETE'])
@login_required
def leave_meal(uid):
    """Leave a meal."""
    meal = Meal.find(uid)
    if meal is None:
        raise NotFound(Errors.MEAL_NOT_FOUND)
    if meal.scheduled_for < dt.now().astimezone():
        raise BadRequest(Errors.MEAL_ALREADY_HAPPENED)
    um = UserMeal.query.get((current_user.id, meal.id))
    if um is None:
        raise PreconditionRequired(Errors.MEAL_NOT_JOINED)
    um.delete()
    return jsonify(data=None, message=Success.MEAL_WAS_LEFT), 204


@blueprint.update()
@login_required
def update_meal(uid):
    """Update a meal."""
    return jsonify(data=update_or_replace_meal(uid, request.json, False),
                   message=Success.MEAL_UPDATED), 202


@blueprint.replace()
@login_required
def replace_meal(uid):
    """Replace a meal."""
    return jsonify(data=update_or_replace_meal(uid, request.json, True),
                   message=Success.MEAL_UPDATED), 202


@blueprint.destroy()
@login_required
def destroy_meal(uid):
    """Destroy a meal."""
    meal = Meal.find(uid)
    if meal is None:
        raise NotFound(Errors.MEAL_NOT_FOUND)
    if current_user.id != meal.host.id:
        raise Forbidden(Errors.NOT_YOUR_MEAL)
    meal.delete()
    # TODO: should we have logic to refund or make sure there are no guests?
    return jsonify(data=None, message=Success.MEAL_DELETED), 204


@blueprint.flexible_route('/mine/<string:role>')
@login_required
def get_user_meals(role):
    """Get a user's meals based on their role in the meal.

    :param role string: `role` can be either: 'guest', or 'host'

    a `role` of "guest" will return all the meals that the user has joined.
    a `role` of "host" will return all the meals that the user is hosting.
    """
    valid_roles = set(['guest', 'host'])
    if role not in valid_roles:
        raise BadRequest(Errors.INVALID_MEAL_ROLE)
    if role == 'guest':
        meals = current_user.get_joined_meals()
    else:
        meals = current_user.get_hosted_meals()
    return jsonify(data=PRIVATE_MEAL_SCHEMA.dump(meals, many=True).data)
