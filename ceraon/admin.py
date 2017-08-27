# -*- coding: utf-8 -*-
"""The admin module."""
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user
from werkzeug.exceptions import NotFound


class AdminModelView(ModelView):
    """A base admin view."""

    column_exclude_list = ['password']

    @staticmethod
    def _is_accessible():
        """Figure out whether the user can admin the access panel."""
        return current_user.is_authenticated and current_user.is_admin

    @staticmethod
    def _inaccessible_callback(*args):
        """Let's pretend this page doesn't exist."""
        raise NotFound()

    def is_accessible(self):
        """Blocks users that aren't allowed in."""
        return self._is_accessible()

    def inaccessible_callback(self, name, **kwargs):
        """Throws the user to a 401 page if they shouldn't be here."""
        return self._inaccessible_callback()
