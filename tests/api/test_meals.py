# -*- encoding: utf-8 -*-
"""Test the views at /api/v1/meals."""

import uuid

import pytest

from tests.utils import BaseViewTest


@pytest.mark.usefixtures('db')
class TestFindMeal(BaseViewTest):
    """Test GET /api/v1/meals/UUID."""

    base_url = '/api/v1/meals/{}'

    def test_nonexistent_get(self, testapp):
        """Test the a nonexistent get returns a 404."""
        res = testapp.get(self.base_url.format(uuid.uuid4()), status=404)
        assert res.status_code == 404
        assert 'error_code' in res.json
        assert 'error_message' in res.json

    def test_successful_get(self, testapp, meal):
        """Test that a normal GET works just fine."""
        res = testapp.get(self.base_url.format(meal.id))
        assert res.status_code == 200
        data = res.json['data']
        assert 'id' in data
        assert 'name' in data
        assert 'description' in data
        assert 'price' in data
        assert 'scheduled_for' in data
        assert 'host' in data


@pytest.mark.usefixtures('db')
class TestCreateMeal(BaseViewTest):
    """Test POST /api/v1/meals."""

    base_url = '/api/v1/meals'

    valid_data = {
    }

    def test_unauthenticated_create(self, testapp):
        """Test that we get a 401 if the user is not authenticated."""
        res = testapp.post_json(self.base_url, self.valid_data, status=401)
        assert res.status_code == 401

    def test_user_not_created_location(self, testapp, user):
        """Test that 428 is returned if the user has no location."""
        self.login(user, testapp)
        res = testapp.post_json(self.base_url, self.valid_data, status=428)
        assert res.status_code == 428
