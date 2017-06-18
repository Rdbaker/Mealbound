"""Basic login auth support"""

from flask import g, current_app
from flask_httpauth import HTTPBasicAuth

from ceraon.user.models import User

BasicAuth = HTTPBasicAuth()

@BasicAuth.verify_password
def verify_password(username, password):
    user = User.query.filter_by(username=username).first()
    if not user:
        return False
    if not user.check_password(password):
        return False
    if not user.active:
        return False
    return True
