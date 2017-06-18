"""Token auth support."""

from flask import g, current_app
from flask_httpauth import HTTPTokenAuth

from ceraon.user.models import User

TokenAuth = HTTPTokenAuth(scheme='Token')

@TokenAuth.verify_token
def verify_token(token):
    user = User.verify_token(token)
    if (user):
        return True
    return False