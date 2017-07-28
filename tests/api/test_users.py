# -*- encoding: utf-8 -*-
"""Test the views at /api/v1/users."""

import pytest
from flask import url_for

from ceraon.user.models import User
from tests.utils import BaseViewTest


@pytest.mark.usefixtures('db')
class TestFindUser:
    """Test GET /api/v1/meals/ID."""

    base_url = '/api/v1/users/{}'

    def test_nonexistent_get(self, testapp):
        """Test the a nonexistent get returns a 404."""
        res = testapp.get(self.base_url.format(1), status=404)
        assert res.status_code == 404
        assert 'error_code' in res.json
        assert 'error_message' in res.json

    def test_successful_get(self, testapp, user):
        """Test that a normal GET works just fine."""
        res = testapp.get(self.base_url.format(user.id))
        assert res.status_code == 200
        data = res.json['data']
        assert 'id' in data
        assert 'public_name' in data
        assert 'image_url' in data
        assert 'created_at' in data
        assert 'email' not in data
        assert 'address' not in data


@pytest.mark.usefixtures('db')
class TestGetMe(BaseViewTest):
    """Test the GET /api/v1/users/me endpoint."""

    base_url = '/api/v1/users/me'

    def test_unauthenticated(self, testapp):
        """Test that not logged in gets a 401."""
        res = testapp.get(self.base_url, status=401)
        assert res.status_code == 401

    def test_get_self(self, testapp, user):
        """Test that logged in gets self."""
        self.login(user, testapp)
        res = testapp.get(self.base_url)
        assert res.status_code == 200
        data = res.json['data']
        assert 'email' in data
        assert 'address' in data
        assert 'first_name' in data
        assert 'last_name' in data


@pytest.mark.usefixtures('db')
class TestUpdateMe(BaseViewTest):
    """Test the PATCH /api/v1/users/me endpoint."""

    base_url = '/api/v1/users/me'

    def setup_method(self, method):
        """Set up the test class. Pytest will call this for us."""
        self.update_data = {
            'first_name': 'new first name',
            'last_name': 'new first name',
            'address': '121 High Street, Boston, MA',
        }
        self.update_pw_data = {
            'password': 'newpassword',
            'confirm_pw': 'newpassword'
        }

    def test_authenticated(self, testapp):
        """Test that not logged in gets a 401."""
        res = testapp.patch_json(self.base_url, self.update_data, status=401)
        assert res.status_code == 401

    def test_update_some_fields(self, testapp, user):
        """Test that a user can update their info."""
        self.login(user, testapp)
        res = testapp.patch_json(self.base_url, self.update_data)
        assert res.status_code == 200
        assert user.first_name == self.update_data['first_name']
        assert user.last_name == self.update_data['last_name']
        assert user.address == self.update_data['address']
        assert user.location.address == self.update_data['address']

    def test_update_password(self, testapp, user):
        """Test that a user's new password works."""
        self.login(user, testapp)
        res = testapp.patch_json(self.base_url, self.update_pw_data)
        assert res.status_code == 200
        testapp.get(url_for('public.logout')).follow()
        self.login(user, testapp, self.update_pw_data['password'])
