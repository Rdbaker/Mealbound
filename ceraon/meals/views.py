# -*- coding: utf-8 -*-
"""Meal views."""
from flask import (Blueprint, render_template, request, flash, redirect,
                   url_for, abort)
from flask_login import login_required, current_user
from flask_paginate import Pagination

from ceraon.constants import Errors, Success
from ceraon.meals.forms import MealForm
from ceraon.models.meals import Meal, UserMeal
from ceraon.utils import flash_errors

blueprint = Blueprint('meal', __name__, url_prefix='/meal',
                      static_folder='../static')


@blueprint.route('/', methods=['GET', 'POST'])
@login_required
def create():
    """Create a new meal for the logged in user's location."""
    # redirect to location create form if the user doesn't have a location
    if not current_user.location.address:
        flash(Errors.LOCATION_NOT_CREATED_YET[1], 'error')
        return redirect(url_for('location.edit'))

    form = MealForm(request.form)

    if form.validate_on_submit():
        flash(Success.MEAL_CREATED[1], 'success')
        Meal.create(name=form.name.data, description=form.description.data,
                    scheduled_for=form.scheduled_for.data, price=form.cost.data,
                    location=current_user.location)
        return redirect(url_for('location.mine'))
    else:
        flash_errors(form)
    return render_template('meals/create.html', form=form)


@blueprint.route('/search', methods=['GET', 'POST'])
def search():
    """Search for a meal based on search parameters."""
    page_num = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    page = Meal.upcoming().order_by(Meal.scheduled_for)\
        .paginate(page=page_num, per_page=per_page)
    pagination = Pagination(page=page_num, per_page=per_page, search=True,
                            found=(per_page * page.pages), bs_version=3,
                            record_name='meals', outer_window=0,
                            total=(per_page * page.pages))
    return render_template('meals/list.html', meals=page.items,
                           pagination=pagination)


@blueprint.route('/edit/<string:uid>', methods=['GET', 'POST'])
@login_required
def edit(uid):
    """Edits a meal."""
    meal = Meal.find(uid)
    if not meal.host == current_user:
        return abort(401)

    form = MealForm(name=meal.name, description=meal.description,
                    scheduled_for=meal.scheduled_for, cost=meal.price)

    if form.validate_on_submit():
        flash(Success.MEAL_CREATED[1], 'success')
        meal.update(name=form.name.data, description=form.description.data,
                    scheduled_for=form.scheduled_for.data, price=form.cost.data)
        return redirect(url_for('location.mine'))
    else:
        flash_errors(form)
    return render_template('meals/create.html', form=form)


# Must use POST here - HTML forms don't support DELETE.
@blueprint.route('/<string:uid>/delete', methods=['POST'])
@login_required
def destroy(uid):
    """Delete a meal."""
    meal = Meal.find(uid)
    if not meal.host == current_user:
        flash(Errors.CANT_DELETE_MEAL[1])
    meal.delete()
    return redirect(url_for('location.mine'))


@blueprint.route('/<string:uid>', methods=['GET'])
def show(uid):
    """Show the meal with the given UID."""
    return render_template('meals/show.html', meal=Meal.find(uid))


@blueprint.route('/<string:uid>/reservation', methods=['POST', 'DELETE'])
@login_required
def join_or_leave_meal(uid):
    """Join a meal or leave a meal."""
    meal = Meal.find(uid)
    if not meal.joined(current_user):
        return join_meal(meal)
    else:
        return leave_meal(meal)


def join_meal(meal):
    """Allow a user to join a meal."""
    # TODO: do some validation here
    UserMeal.create(meal=meal, user=current_user)
    flash(Success.MEAL_WAS_JOINED[1], 'success')
    return redirect(url_for('meal.show', uid=meal.id))


def leave_meal(meal):
    """Allow a user to leave the meal."""
    um = UserMeal.query.get((current_user.id, meal.id))
    um.delete()
    flash(Success.MEAL_WAS_LEFT[1], 'info')
    return redirect(url_for('meal.show', uid=meal.id))
