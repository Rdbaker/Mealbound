# -*- encoding: utf-8 -*-
"""Utils for tests."""


class BaseViewTest:
    """A base test for testing views."""

    def login(self, user, testapp, password='example'):
        """Log a user in given a user, testapp, and password."""
        res = testapp.get('/login')
        form = res.forms['loginForm']
        form['email'] = user.email
        form['password'] = password
        return form.submit().follow()
