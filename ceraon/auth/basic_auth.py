"""Basic login auth support."""

from flask_httpauth import HTTPBasicAuth

from ceraon.user.models import User

BasicAuth = HTTPBasicAuth()


@BasicAuth.verify_password
def verify_password(email, password):
    """Verify the email/pw combo."""
    user = User.query.filter_by(email=email).first()
    if not user:
        return False
    if not user.check_password(password):
        return False
    if not user.active:
        return False
    return True
