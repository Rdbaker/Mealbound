# -*- coding: utf-8 -*-
"""Helper utilities and decorators."""
from threading import Thread

import requests
from flask import Blueprint, current_app, flash, request


def get_fb_access_token():
    """Get an access token from facebook for graph API calls."""
    base_url = 'https://graph.facebook.com/oauth/access_token?' \
        'grant_type=client_credentials'
    res = requests.get(
        base_url + '&client_id={}'.format(current_app.config['FB_APP_ID']) +
        '&client_secret={}'.format(current_app.config['FB_APP_SECRET']))
    return res.json().get('access_token')


def friendly_arg_get(key, default=None, type_cast=None):
    """Same as request.args.get but returns default on ValueError."""
    try:
        return request.args.get(key, default=default, type=type_cast)
    except:
        return default


class FlaskThread(Thread):
    """A utility class for threading in a flask app."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.app = current_app._get_current_object()

    def run(self):
        with self.app.app_context():
            super().run()


def flash_errors(form, category='warning'):
    """Flash all errors for a form."""
    for field, errors in form.errors.items():
        for error in errors:
            flash('{0} - {1}'.format(getattr(form, field).label.text, error),
                  category)


class RESTBlueprint(Blueprint):
    """A base class for a RESTful API's view blueprint.

    This comes with helper methods that set up routes based on method/actions.
    It infers the route_prefix based on the version and blueprint name in the
    format: `/api/<version string>/<blueprint name string>`
    then creates routes from that.

    Example usage:

        mod = RESTBlueprint('users', __name__, 'v2')

        # route is: GET /api/v2/users/<uid>
        @mod.find()
        def find_user(uid):
            return User.get(uid)

        # route is: PATCH /api/v2/users/<uid>
        @mod.update()
        def update_user(uid):
            return User.update(name='new name')

        # route is: POST /api/v2/users
        @mod.create()
        def create_user():
            return User.create(name='my new user')

    The `find`, `update`, `replace`, and `destroy` methods will add a string
    parameter called `uid` to your route. Make sure to correctly resolve that to
    your entity's ID.
    """

    def __init__(self, blueprint_name, name, version):
        return super(RESTBlueprint, self).__init__(
            'api.{}.{}'.format(version, blueprint_name),
            name, url_prefix='/api/{}/{}'.format(version, blueprint_name))

    def flexible_route(self, *args, **kwargs):
        kwargs.update({'strict_slashes': False})
        return self.route(*args, **kwargs)

    def create(self, *args, **kwargs):
        kwargs.update({'methods': ['POST']})
        return self.flexible_route('/', *args, **kwargs)

    def list(self, *args, **kwargs):
        kwargs.update({'methods': ['GET']})
        return self.flexible_route('/', *args, **kwargs)

    def find(self, *args, **kwargs):
        kwargs.update({'methods': ['GET']})
        return self.flexible_route('/<string:uid>', *args, **kwargs)

    def update(self, *args, **kwargs):
        kwargs.update({'methods': ['PATCH']})
        return self.flexible_route('/<string:uid>', *args, **kwargs)

    def replace(self, *args, **kwargs):
        kwargs.update({'methods': ['PUT']})
        return self.flexible_route('/<string:uid>', *args, **kwargs)

    def destroy(self, *args, **kwargs):
        kwargs.update({'methods': ['DELETE']})
        return self.flexible_route('/<string:uid>', *args, **kwargs)
