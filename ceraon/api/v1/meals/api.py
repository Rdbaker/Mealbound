"""API routes for meals."""

from flask import jsonify, request
from flask_login import current_user, login_required

from ceraon.constants import Errors
from ceraon.errors import NotFound, PreconditionRequired
from ceraon.models.meals import Meal
from ceraon.utils import RESTBlueprint, friendly_arg_get

from .schema import MealSchema

blueprint = RESTBlueprint('meals', __name__, version='v1')

MEAL_SCHEMA = MealSchema()


@blueprint.find()
def find_meal(uid):
    """Find a meal from it's UUID."""
    meal = Meal.find(uid)
    if meal is None:
        raise NotFound(Errors.MEAL_NOT_FOUND)
    return jsonify(data=MEAL_SCHEMA.dump(meal).data)


@blueprint.list()
def list_meals():
    """Search for a meal based on search parameters."""
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
    MEAL_SCHEMA.load(request.json)
