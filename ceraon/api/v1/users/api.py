"""API routes for users."""

from flask import jsonify, request
from flask_login import current_user, login_required

from ceraon.constants import Errors, Success
from ceraon.errors import BadRequest, NotFound
from ceraon.user.models import User
from ceraon.utils import RESTBlueprint

from .schema import UserSchema

blueprint = RESTBlueprint('users', __name__, version='v1')

USER_SCHEMA = UserSchema(only=('created_at', 'public_name', 'image_url', 'id'))
PRIVATE_USER_SCHEMA = UserSchema()


@blueprint.flexible_route('/me', methods=['GET'])
@login_required
def get_me():
    """
    Get the logged in user.

    ---
    tags:
      - users
    definitions:
      - schema:
          id: User
          properties:
            id:
             type: integer
             description: the user's ID
            created_at:
             type: dateTime
             description: ISO-8601 date string for when the user was created
            public_name:
             type: string
             description: the name to display in the app
            first_name:
             type: string
             description: the first name of the user
            last_name:
             type: string
             description: the last name of the user
            image_url:
             type: string
             description: the URL of the user's profile photo
            email:
             type: string
             description: the email of the user (private)
            address:
             type: string
             description: the address of the user's location (private)
    responses:
      200:
        description: User data found
        schema:
          id: User
      401:
        description: The user is not authenticated
    """
    return jsonify(data=PRIVATE_USER_SCHEMA.dump(current_user).data)


@blueprint.flexible_route('/me', methods=['PATCH'])
@login_required
def update_me():
    """
    Update data for the currently logged in user.

    ---
    tags:
      - users
    parameters:
      - in: body
        name: body
        schema:
          id: User
          properties:
            address:
              type: string
              description: the address for the user's location
            first_name:
              type: string
            last_name:
              type: string
            email:
              type: string
            password:
              type: string
            confirm_pw:
              type: string
              description: the confirmation for the user's new password
    responses:
      200:
        description: User data updated
        schema:
          id: User
      400:
        description: The password and confirm_pw didn't match
      401:
        description: The user is not authenticated
      422:
        description: The data did not pass validation
    """
    user_data = PRIVATE_USER_SCHEMA.load(request.json, partial=True).data
    if 'password' in request.json:
        if request.json.get('password') != request.json.get('confirm_pw'):
            raise BadRequest(Errors.PASSWORD_CONFIRM_MATCH)
        else:
            current_user.set_password(request.json.get('password'))
    current_user.update(**user_data)
    return jsonify(data=PRIVATE_USER_SCHEMA.dump(current_user).data,
                   message=Success.PROFILE_UPDATED), 200


@blueprint.find()
def find_user(uid):
    """
    Find the user specified by the ID.

    ---
    tags:
      - users
    parameters:
      - in: path
        name: uid
        description: The user's id
        required: true
    responses:
      200:
        description: User data found
        schema:
          id: User
      404:
        description: The user could not be found
    """
    user = User.find(uid)
    if user is None:
        raise NotFound(Errors.USER_NOT_FOUND)
    return jsonify(data=USER_SCHEMA.dump(user).data)
