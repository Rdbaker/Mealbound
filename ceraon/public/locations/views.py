# -*- coding: utf-8 -*-
"""Location views."""
from flask import Blueprint, render_template, request, flash
from flask_login import login_required, current_user

from ceraon.public.locations.forms import CreateLocationForm
from ceraon.models.locations import Location
from ceraon.utils import flash_errors

blueprint = Blueprint('location', __name__, url_prefix='/location', static_folder='../static')


@blueprint.route('/', methods=['GET', 'POST'])
@login_required
def create():
    """List members."""
    form = CreateLocationForm(request.form)
    if form.validate_on_submit():
        Location.create(host=current_user, name=form.name.data)
        flash('You created your location!', 'success')
        return redirect(url_for('user.members'))
    else:
        flash_errors(form)
    return render_template('public/locations/create.html', form=form)


@blueprint.route('/mine', methods=['GET'])
@login_required
def mine():
    """Show the user their location."""
    return render_template('public/locations/mine.html',
                           location=current_user.location)

@blueprint.route('/<string:uid>', methods=['GET'])
def show(uid):
    """Show the location with the UID."""
    return render_template('public/locations/show.html',
                           location=Location.find(uid))
