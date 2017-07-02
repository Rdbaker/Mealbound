# -*- coding: utf-8 -*-
"""Location views."""
from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required
from flask_paginate import Pagination

from ceraon.constants import Success
from ceraon.locations.forms import LocationForm
from ceraon.models.locations import Location
from ceraon.utils import FlaskThread, flash_errors

blueprint = Blueprint('location', __name__, url_prefix='/location',
                      static_folder='../static')


@blueprint.route('/', methods=['GET', 'POST'])
def search():
    """Search for the locations for the user."""
    page_num = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    page = Location.query.paginate(page=page_num, per_page=per_page)
    pagination = Pagination(page=page_num, per_page=per_page, search=True,
                            found=(per_page * page.pages), bs_version=3,
                            record_name='locations', outer_window=0,
                            total=(per_page * page.pages))
    return render_template('locations/list.html', locations=page.items,
                           pagination=pagination)


@blueprint.route('/list', methods=['GET'])
def list():
    """List the locations near the user."""
    return search()


@blueprint.route('/mine', methods=['GET'])
@login_required
def mine():
    """Show the user their location."""
    if not current_user.location.address:
        return redirect(url_for('location.edit'))

    return render_template('locations/mine.html',
                           location=current_user.location)


@blueprint.route('/mine/edit', methods=['GET', 'POST'])
@login_required
def edit():
    """Allow the user to edit their location."""
    form = LocationForm(name=current_user.location.name,
                        address=current_user.location.address)
    if request.method == 'GET':
        return render_template('locations/edit.html',
                               location=current_user.location, form=form)
    else:
        if form.validate_on_submit():
            current_user.location.update(name=form.name.data,
                                         address=form.address.data)
            th = FlaskThread(target=current_user.location.update_coordinates)
            th.start()
            flash(Success.LOCATION_UPDATED[1], 'success')
            return redirect(url_for('location.mine'))
        else:
            flash_errors(form)
            return render_template('locations/edit.html',
                                   location=current_user.location, form=form)


@blueprint.route('/<string:uid>', methods=['GET'])
def show(uid):
    """Show the location with the UID."""
    return render_template('locations/show.html', location=Location.find(uid))
