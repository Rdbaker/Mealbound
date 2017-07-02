# -*- coding: utf-8 -*-
"""Test forms."""

from ceraon.public.forms import LoginForm
from ceraon.user.forms import RegisterForm


class TestRegisterForm:
    """Register form."""

    def test_validate_email_already_registered(self, user):
        """Enter email that is already registered."""
        form = RegisterForm(email=user.email, password='example',
                            first_name='foo', last_name='foo',
                            confirm='example')

        assert form.validate() is False
        assert 'Email already registered' in form.email.errors

    def test_validate_success(self, db):
        """Register with success."""
        form = RegisterForm(email='new@test.test', password='example',
                            first_name='foo', last_name='foo',
                            confirm='example')
        assert form.validate() is True


class TestLoginForm:
    """Login form."""

    def test_validate_success(self, user):
        """Login successful."""
        user.set_password('example')
        user.save()
        form = LoginForm(email=user.email, password='example')
        assert form.validate() is True
        assert form.user == user

    def test_validate_unknown_email(self, db):
        """Unknown email."""
        form = LoginForm(email='unknown', password='example')
        assert form.validate() is False
        assert 'Invalid email address.' in form.email.errors
        assert form.user is None

    def test_validate_invalid_password(self, user):
        """Invalid password."""
        user.set_password('example')
        user.save()
        form = LoginForm(email=user.email, password='wrongpassword')
        assert form.validate() is False
        assert 'Invalid password' in form.password.errors

    def test_validate_inactive_user(self, user):
        """Inactive user."""
        user.active = False
        user.set_password('example')
        user.save()
        # Correct email and password, but user is not activated
        form = LoginForm(email=user.email, password='example')
        assert form.validate() is False
        assert 'User not activated' in form.email.errors
