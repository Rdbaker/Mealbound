# -*- coding: utf-8 -*-
"""Location views."""
from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user

from ceraon.public.locations.forms import LocationForm
from ceraon.models.locations import Location
from ceraon.utils import flash_errors

blueprint = Blueprint('location', __name__, url_prefix='/location', static_folder='../static')


@blueprint.route('/', methods=['GET', 'POST'])
def search():
    """Search for the locations for the user."""
    page = Location.query.paginate(page=int(request.args.get('page', 1)),
                                   per_page=int(request.args.get('per_page',
                                                                 10)))
    meta_pagination = {
        'current': {
            'num': page.page,
            'link': 'javascript:void(0)'
        },
        'first': {
            'num': 1,
            'link': request.path + '?page={page}&per_page={per_page}'.format(
                page=1, per_page=page.per_page)
        },
        'next': {
            'num': page.next_num or page.pages,
            'link': request.path + '?page={page}&per_page={per_page}'.format(
                page=page.next_num or page.pages, per_page=page.per_page)
        },
        'last': {
            'num': page.pages,
            'link': request.path + '?page={page}&per_page={per_page}'.format(
                page=page.pages, per_page=page.per_page)
        },
        'prev': {
            'num': page.prev_num or 1,
            'link': request.path + '?page={page}&per_page={per_page}'.format(
                page=page.prev_num or 1, per_page=page.per_page)
        }
    }

    return render_template('public/locations/list.html', locations=page.items,
                           pagination=meta_pagination)


@blueprint.route('/list', methods=['GET'])
def list():
    """List the locations near the user."""
    return search()


@blueprint.route('/new', methods=['GET', 'POST'])
@login_required
def create():
    form = LocationForm(request.form)
    if form.validate_on_submit():
        Location.create(host=current_user, name=form.name.data)
        flash('You created your location!', 'success')
        return redirect(url_for('location.mine'))
    else:
        flash_errors(form)
    return render_template('public/locations/create.html', form=form)


@blueprint.route('/mine', methods=['GET'])
@login_required
def mine():
    """Show the user their location."""
    return render_template('public/locations/mine.html',
                           location=current_user.location)


@blueprint.route('/mine/edit', methods=['GET', 'POST'])
@login_required
def edit():
    """Allow the user to edit their location."""
    form = LocationForm(name=current_user.location.name)
    if request.method == 'GET':
        return render_template('public/locations/edit.html',
                               location=current_user.location, form=form)
    else:
        if form.validate_on_submit():
            current_user.location.update(name=form.name.data)
            flash('You updated your location!', 'success')
            return redirect(url_for('location.mine'))
        else:
            flash_errors(form)
            return render_template('public/locations/edit.html',
                                   location=current_user.location, form=form)


@blueprint.route('/<string:uid>', methods=['GET'])
def show(uid):
    """Show the location with the UID."""
    return render_template('public/locations/show.html',
                           location=Location.find(uid))
