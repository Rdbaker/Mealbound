"""API routes for sessions (login)."""

from flask import jsonify

from ceraon.user.schema import UserSchema
from ceraon.utils import RESTBlueprint

from .utils import get_fb_user_from_cookie, resolve_user_from_fb_response


blueprint = RESTBlueprint('sessions', __name__, version='v1')


@blueprint.flexible_route('/facebook', methods=['POST'])
def create_fb_session():
    """Log the user in to Facebook based on the cookie."""
    user_from_fb = get_fb_user_from_cookie()
    user = resolve_user_from_fb_response(user_from_fb)
    return jsonify(data=UserSchema().dump(user).data)
