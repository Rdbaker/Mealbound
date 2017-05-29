# -*- coding: utf-8 -*-
"""User views."""
from flask import Blueprint, render_template, request, flash, redirect
from flask_login import login_required, current_user

from ceraon.locations.forms import LocationForm
from ceraon.models.locations import Location
from ceraon.models.meals import Meal, UserMeal
from ceraon.utils import flash_errors

import datetime as dt

blueprint = Blueprint('user', __name__, url_prefix='/users',
                      static_folder='../static')

def filterMealByDate(meal):
    return meal.scheduled_for >= dt.datetime.now()

@blueprint.route('/me', methods=['GET'])
@login_required
def me():
    userMeals = UserMeal.query.filter(UserMeal.user_id == current_user.id)
    myMeals = [userMeal.meal for userMeal in userMeals]

    return render_template('users/me.html', meals=list(filter(filterMealByDate, myMeals)))

