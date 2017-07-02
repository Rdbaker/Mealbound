"""API routes for sessions (login)."""

from flask import url_for
from flask_login import login_user
from werkzeug.exceptions import Forbidden, Unauthorized

from ceraon.utils import RESTBlueprint

from .facebook import get_fb_user_from_cookie, resolve_user_from_fb_response

blueprint = RESTBlueprint('sessions', __name__, version='v1')


@blueprint.flexible_route('/facebook', methods=['POST'])
def create_fb_session():
    """Log the user in to Facebook based on the cookie."""
    user_from_fb = get_fb_user_from_cookie()
    if user_from_fb is None:
        raise Unauthorized('you must be logged in to Facebook')

    user = resolve_user_from_fb_response(user_from_fb)
    if user is None:
        raise Forbidden('email is required')
    login_user(user, force=True)

    return url_for('user.me')
