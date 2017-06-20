"""Token auth support."""

from flask_httpauth import HTTPTokenAuth

from ceraon.user.models import User

TokenAuth = HTTPTokenAuth(scheme='Token')


@TokenAuth.verify_token
def verify_token(token):
    """Verify the token that was passed in matches a user."""
    user = User.verify_token(token)
    if (user):
        return True
    return False
