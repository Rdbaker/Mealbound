"""API routes for tokens."""

from flask import jsonify

from ceraon.auth.basic_auth import BasicAuth
from ceraon.user.models import User
from ceraon.utils import RESTBlueprint

from .schema import TokenSchema

blueprint = RESTBlueprint('token', __name__, version='v1')

TOKEN_SCHEMA = TokenSchema()


@blueprint.list()
@BasicAuth.login_required
def get_token():
    """Get the token for a user."""
    current_user = User.query.filter_by(email=BasicAuth.email()).first()

    if current_user:
        token = current_user.get_auth_token()
        return jsonify(data=TOKEN_SCHEMA.dump({'token': token}).data)
    else:
        return jsonify(data=TOKEN_SCHEMA.dump('').data)
