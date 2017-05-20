# -*- coding: utf-8 -*-
"""Helper utilities and decorators."""
from flask import flash, Blueprint


def flash_errors(form, category='warning'):
    """Flash all errors for a form."""
    for field, errors in form.errors.items():
        for error in errors:
            flash('{0} - {1}'.format(getattr(form, field).label.text, error), category)


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
        return self.route(*args, **kwargs, strict_slashes=False)

    def create(self, *args, **kwargs):
        return self.flexible_route('/', *args, **kwargs, methods=['POST'])

    def list(self, *args, **kwargs):
        return self.flexible_route('/', *args, **kwargs, methods=['GET'])

    def find(self, *args, **kwargs):
        return self.flexible_route('/<string:uid>', *args, **kwargs,
            methods=['GET'])

    def update(self, *args, **kwargs):
        return self.flexible_route('/<string:uid>', *args, **kwargs,
            methods=['PATCH'])

    def replace(self, *args, **kwargs):
        return self.flexible_route('/<string:uid>', *args, **kwargs,
            methods=['PUT'])

    def destroy(self, *args, **kwargs):
        return self.flexible_route('/<string:uid>', *args, **kwargs,
            methods=['DELETE'])
