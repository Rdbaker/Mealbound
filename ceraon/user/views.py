# -*- coding: utf-8 -*-
"""User views."""
from flask import Blueprint, render_template, request, flash, url_for, redirect
from flask_login import login_required, current_user

from ceraon.models.meals import UserMeal, Meal
from ceraon.utils import flash_errors

from .forms import EditProfileForm

blueprint = Blueprint('user', __name__, url_prefix='/users',
                      static_folder='../static')


@blueprint.route('/me', methods=['GET'])
@login_required
def me():
    """Return the home page for the user."""
    meals = Meal.upcoming().join(UserMeal.meal)\
        .filter(UserMeal.user_id == current_user.id)
    return render_template('users/me.html', meals=meals.all())


@blueprint.route('/me/edit', methods=['GET', 'POST'])
@login_required
def edit_profile():
    """Return the edit profile page for the user."""
    form = EditProfileForm(
        first_name=current_user.first_name, last_name=current_user.last_name,
        username=current_user.username, email=current_user.email,
        address=current_user.location.address, user=current_user)
    if request.method == 'GET':
        return render_template('users/edit.html', form=form)
    else:
        if form.validate_on_submit():
            if form.address.data:
                current_user.location.address = form.address.data
                current_user.location.save()
            current_user.update(
                username=form.username.data, first_name=form.first_name.data,
                last_name=form.last_name.data, email=form.email.data)
            if form.password.data:
                current_user.set_password(form.password.data)
                current_user.save()
            flash('You successfully updated your profile', 'info')
            return redirect(url_for('user.me'))
        else:
            flash_errors(form)
            return render_template('users/edit.html', form=form)
