"""API routes for users."""

from flask import jsonify, request
from flask_login import current_user, login_required

from ceraon.constants import Errors, Success
from ceraon.errors import NotFound, BadRequest
from ceraon.user.models import User
from ceraon.utils import RESTBlueprint

from .schema import UserSchema

blueprint = RESTBlueprint('users', __name__, version='v1')

USER_SCHEMA = UserSchema(only=('created_at', 'public_name', 'image_url', 'id'))
PRIVATE_USER_SCHEMA = UserSchema()


@blueprint.flexible_route('/me', methods=['GET'])
@login_required
def get_me():
    """Get data for the current user."""
    return jsonify(data=PRIVATE_USER_SCHEMA.dump(current_user).data)


@blueprint.flexible_route('/me', methods=['PATCH'])
@login_required
def update_me():
    """Update data for the current user."""
    user_data = PRIVATE_USER_SCHEMA.load(request.json, partial=True).data
    if 'password' in request.json:
        if request.json.get('password') != request.json.get('confirm_pw'):
            raise BadRequest(Errors.PASSWORD_CONFIRM_MATCH)
        else:
            current_user.set_password(request.json.get('password'))
    current_user.update(**user_data)
    return jsonify(data=PRIVATE_USER_SCHEMA.dump(current_user).data,
                   message=Success.PROFILE_UPDATED), 202


@blueprint.find()
def find_user(uid):
    """Find the user specified by the ID."""
    user = User.find(uid)
    if user is None:
        raise NotFound(Errors.USER_NOT_FOUND)
    return jsonify(data=USER_SCHEMA.dump(user).data)
