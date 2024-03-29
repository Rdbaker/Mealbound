# -*- encoding: utf-8 -*-
"""Test the views at /api/v1/meals."""

import uuid
from datetime import datetime as dt
from datetime import timedelta as td
from unittest.mock import patch

import pytest

from ceraon.models.meals import Meal, UserMeal
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

    def setup_method(self, method):
        """Set up the test class. Pytest will call this for us."""
        self.valid_data = {
            'scheduled_for': (dt.now().astimezone() + td(days=1)).isoformat(),
            'name': 'some new meal',
            'description': 'this is my description',
            'price': 7.00,
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

    def test_meal_needs_name(self, testapp, host, hosted_location):
        """Test that a meal needs a name."""
        del self.valid_data['name']
        self.login(host, testapp)
        res = testapp.post_json(self.base_url, self.valid_data, status=422)
        assert 'name' in res.json['error_message']

    def test_meal_with_tags(self, testapp, host, hosted_location, tag_one):
        """Test creating a meal with a tag associated."""
        post_data = {'tags': [{'id': tag_one.id}]}
        post_data.update(self.valid_data)
        self.login(host, testapp)
        res = testapp.post_json(self.base_url, post_data)
        assert 'tags' in res.json['data']
        assert res.json['data']['tags'][0]['id'] == tag_one.id

    def test_meal_needs_price(self, testapp, host, hosted_location):
        """Test that a meal needs a price."""
        del self.valid_data['price']
        self.login(host, testapp)
        res = testapp.post_json(self.base_url, self.valid_data, status=422)
        assert 'price' in res.json['error_message']

    def test_meal_price_positive(self, testapp, host, hosted_location):
        """Test that a meal needs a positive price."""
        self.valid_data['price'] = -1.50
        self.login(host, testapp)
        res = testapp.post_json(self.base_url, self.valid_data, status=422)
        assert 'price' in res.json['error_message']

    def test_meal_needs_scheduled_for(self, testapp, host, hosted_location):
        """Test that a meal needs a scheduled_for."""
        del self.valid_data['scheduled_for']
        self.login(host, testapp)
        res = testapp.post_json(self.base_url, self.valid_data, status=422)
        assert 'scheduled_for' in res.json['error_message']

    def test_meal_scheduled_for_past(self, testapp, host, hosted_location):
        """Test that a meal needs a scheduled_for in the future."""
        self.valid_data['scheduled_for'] = (dt.now().astimezone() -
                                            td(days=1)).isoformat()
        self.login(host, testapp)
        res = testapp.post_json(self.base_url, self.valid_data, status=422)
        assert 'scheduled_for' in res.json['error_message']

    def test_user_meal_create_successful(self, testapp, host, hosted_location):
        """Test that a user can create a meal."""
        self.login(host, testapp)
        res = testapp.post_json(self.base_url, self.valid_data)
        assert res.status_code == 201
        assert 'message' in res.json
        data = res.json['data']
        assert data['price'] == self.valid_data['price']
        assert data['name'] == self.valid_data['name']
        assert data['description'] == self.valid_data['description']
        # TODO: figure out how to compare that these two values are the same
        # TODO: time across different timezones and uncomment this assert
        # assert data['scheduled_for'] == \
        #     self.valid_data['scheduled_for']


@pytest.mark.usefixtures('db')
class TestUpdateMeal(BaseViewTest):
    """Test PATCH /api/v1/meals/UUID."""

    base_url = '/api/v1/meals/{}'

    def setup_method(self, method):
        """Set up the test class. Pytest will call this for us."""
        self.valid_data = {
            'scheduled_for': (dt.now().astimezone() + td(days=3)).isoformat(),
            'name': 'some new meal name',
            'description': 'this is my new description',
            'price': 7.80,
        }

    def test_unauthenticated(self, testapp, meal):
        """Test that unauthenticated gets a 401."""
        res = testapp.patch_json(self.base_url.format(meal.id),
                                 self.valid_data, status=401)
        assert res.status_code == 401

    def test_no_meal_found(self, testapp, guest, guest_location):
        """Test that a nonexistent meal gets a 404."""
        self.login(guest, testapp)
        res = testapp.patch_json(self.base_url.format(uuid.uuid4()),
                                 self.valid_data, status=404)
        assert res.status_code == 404

    def test_unauthorized(self, testapp, meal, guest, guest_location):
        """Test that unauthorized gets a 403."""
        self.login(guest, testapp)
        res = testapp.patch_json(self.base_url.format(meal.id),
                                 self.valid_data, status=403)
        assert res.status_code == 403

    def test_update_works(self, testapp, host, hosted_location, meal):
        """Test that updating a meal works."""
        self.login(host, testapp)
        res = testapp.patch_json(self.base_url.format(meal.id),
                                 self.valid_data)
        assert res.status_code == 200
        assert meal.price == self.valid_data['price']

    def test_meal_with_tags(self, testapp, host, meal, hosted_location,
                            tag_one):
        """Test updating a meal with a tag associated."""
        patch_data = {'tags': [{'id': tag_one.id}]}
        patch_data.update(self.valid_data)
        self.login(host, testapp)
        res = testapp.patch_json(self.base_url.format(meal.id), patch_data)
        assert 'tags' in res.json['data']
        assert res.json['data']['tags'][0]['id'] == tag_one.id

    def test_partial_update_works(self, testapp, host, hosted_location, meal):
        """Test that only partially updating a meal works."""
        self.login(host, testapp)
        res = testapp.patch_json(self.base_url.format(meal.id),
                                 {'price': 4.00})
        assert res.status_code == 200
        assert meal.price == 4.00


@pytest.mark.usefixtures('db')
class TestReplaceMeal(BaseViewTest):
    """Test PUT /api/v1/meals/UUID."""

    base_url = '/api/v1/meals/{}'

    def setup_method(self, method):
        """Set up the test class. Pytest will call this for us."""
        self.valid_data = {
            'scheduled_for': (dt.now() + td(days=3)).isoformat(),
            'name': 'some new meal name',
            'description': 'this is my new description',
            'price': 7.80,
        }

    def test_unauthenticated(self, testapp, meal):
        """Test that unauthenticated gets a 401."""
        res = testapp.put_json(self.base_url.format(meal.id),
                               self.valid_data, status=401)
        assert res.status_code == 401

    def test_no_meal_found(self, testapp, guest, guest_location):
        """Test that a nonexistent meal gets a 404."""
        self.login(guest, testapp)
        res = testapp.put_json(self.base_url.format(uuid.uuid4()),
                               self.valid_data, status=404)
        assert res.status_code == 404

    def test_unauthorized(self, testapp, meal, guest, guest_location):
        """Test that unauthorized gets a 403."""
        self.login(guest, testapp)
        res = testapp.put_json(self.base_url.format(meal.id),
                               self.valid_data, status=403)
        assert res.status_code == 403

    def test_replace_works(self, testapp, host, hosted_location, meal):
        """Test that replacing a meal works."""
        self.login(host, testapp)
        res = testapp.put_json(self.base_url.format(meal.id),
                               self.valid_data)
        assert res.status_code == 200
        assert meal.price == self.valid_data['price']

    def test_meal_with_tags(self, testapp, host, meal, hosted_location,
                            tag_one):
        """Test replacing a meal with a tag associated."""
        put_data = {'tags': [{'id': tag_one.id}]}
        put_data.update(self.valid_data)
        self.login(host, testapp)
        res = testapp.put_json(self.base_url.format(meal.id), put_data)
        assert 'tags' in res.json['data']
        assert res.json['data']['tags'][0]['id'] == tag_one.id

    def test_partial_replace_fails(self, testapp, host, hosted_location, meal):
        """Test that only partially replacing a meal fails."""
        self.login(host, testapp)
        res = testapp.put_json(self.base_url.format(meal.id),
                               {'price': 4.00}, status=422)
        assert res.status_code == 422
        assert 'name' in res.json['error_message']


@pytest.mark.usefixtures('db')
class TestDestroyMeal(BaseViewTest):
    """Test DELETE /api/v1/meals/UUID."""

    base_url = '/api/v1/meals/{}'

    def test_unauthenticated(self, testapp, meal):
        """Test that unauthenticated gets a 401."""
        res = testapp.delete(self.base_url.format(meal.id), status=401)
        assert res.status_code == 401

    def test_meal_not_found(self, testapp, user):
        """Test that a meal not found gets a 404."""
        self.login(user, testapp)
        res = testapp.delete(self.base_url.format(uuid.uuid4()), status=404)
        assert res.status_code == 404

    def test_not_meal_host(self, testapp, guest, guest_location, meal):
        """Test that not being meal owner gets a 403."""
        self.login(guest, testapp)
        res = testapp.delete(self.base_url.format(meal.id), status=403)
        assert res.status_code == 403

    def test_meal_deleted(self, testapp, host, hosted_location, meal):
        """Test that host can delete a meal."""
        self.login(host, testapp)
        res = testapp.delete(self.base_url.format(meal.id))
        assert res.status_code == 204
        try_find_meal = Meal.find(meal.id)
        assert try_find_meal is None


@pytest.mark.usefixtures('db')
class TestJoinMeal(BaseViewTest):
    """Test POST /api/v1/meals/UUID/reservation."""

    base_url = '/api/v1/meals/{}/reservation'

    def test_unauthenticated(self, testapp, meal):
        """Test that an unauthenticated user gets a 401."""
        res = testapp.post(self.base_url.format(meal.id), status=401)
        assert res.status_code == 401

    def test_meal_not_found(self, testapp, user):
        """Test that a user cannot join a meal that does not exist."""
        self.login(user, testapp)
        res = testapp.post(self.base_url.format(uuid.uuid4()), status=404)
        assert res.status_code == 404

    @patch('ceraon.models.transactions.stripe')
    def test_join_meal_card_on_file(self, stripe_mock, testapp, user, meal):
        """Test that a user can join a meal with a card on file."""
        user.stripe_customer_id = 'customer-id'
        self.login(user, testapp)
        res = testapp.post(self.base_url.format(meal.id))
        assert res.status_code == 201
        new_um = UserMeal.query.get((user.id, meal.id))
        assert new_um is not None

    @patch('ceraon.models.transactions.stripe')
    def test_join_meal_no_card_on_file(self, stripe_mock, testapp, user, meal):
        """Test that a user can join a meal without having a card on file."""
        self.login(user, testapp)
        res = testapp.post_json(self.base_url.format(meal.id),
                                {'stripe_token': 'some-token'})
        assert res.status_code == 201
        new_um = UserMeal.query.get((user.id, meal.id))
        assert new_um is not None

    def test_cannot_join_meal_again(self, testapp, guest, meal):
        """Test that a user cannot join a meal twice."""
        self.login(guest, testapp)
        res = testapp.post(self.base_url.format(meal.id), status=409)
        assert res.status_code == 409

    def test_host_cannot_join_meal(self, testapp, host, meal):
        """Test that a host cannot join their own meal."""
        self.login(host, testapp)
        res = testapp.post(self.base_url.format(meal.id), status=400)
        assert res.status_code == 400

    def test_join_past_meal(self, testapp, user, past_meal):
        """Test that a user cannot join a meal that happened already."""
        self.login(user, testapp)
        res = testapp.post(self.base_url.format(past_meal.id), status=400)
        assert res.status_code == 400


@pytest.mark.usefixtures('db')
class TestLeaveMeal(BaseViewTest):
    """Test DELETE /api/v1/meals/UUID/reservation."""

    base_url = '/api/v1/meals/{}/reservation'

    def test_unauthenticated(self, testapp, meal):
        """Test that an unauthenticated user gets a 401."""
        res = testapp.delete(self.base_url.format(meal.id), status=401)
        assert res.status_code == 401

    def test_leave_meal(self, testapp, guest, meal):
        """Test that a user can leave a meal."""
        self.login(guest, testapp)
        res = testapp.delete(self.base_url.format(meal.id))
        assert res.status_code == 200
        assert res.json['data'] is not None
        new_um = UserMeal.query.get((guest.id, meal.id))
        assert new_um is None

    def test_cannot_leave_meal_again(self, testapp, user, meal):
        """Test that a user cannot leave a meal that has not joined first."""
        self.login(user, testapp)
        res = testapp.delete(self.base_url.format(meal.id), status=428)
        assert res.status_code == 428

    def test_meal_not_found(self, testapp, user):
        """Test that a user cannot leave a meal that does not exist."""
        self.login(user, testapp)
        res = testapp.delete(self.base_url.format(uuid.uuid4()), status=404)
        assert res.status_code == 404

    def test_leave_past_meal(self, testapp, guest, past_meal):
        """Test that a user cannot leave a meal that happened already."""
        self.login(guest, testapp)
        res = testapp.delete(self.base_url.format(past_meal.id), status=400)
        assert res.status_code == 400


@pytest.mark.usefixtures('db')
class TestGetMyMeals(BaseViewTest):
    """Test GET /api/v1/meals/mine/<role>."""

    base_url = '/api/v1/meals/mine/{}'

    def test_unauthenticated(self, testapp, meal):
        """Test that an unauthenticated user gets a 401."""
        res = testapp.get(self.base_url, status=401)
        assert res.status_code == 401

    def test_see_joined_meal(self, testapp, guest, meal):
        """Test that a user can see the meals they joined."""
        self.login(guest, testapp)
        res = testapp.get(self.base_url.format('guest'))
        assert res.status_code == 200
        assert res.json['data'][0]['id'] == str(meal.id)
        assert len(res.json['data']) == 1

    def test_see_hosted_meal(self, testapp, host, meal):
        """Test that a user can see the meals they host."""
        self.login(host, testapp)
        res = testapp.get(self.base_url.format('host'))
        assert res.status_code == 200
        assert res.json['data'][0]['id'] == str(meal.id)
        assert len(res.json['data']) == 1

    def test_see_hosts_joined_meals(self, testapp, host, meal):
        """Check that the host has joined no meals... just a sanity check."""
        self.login(host, testapp)
        res = testapp.get(self.base_url.format('guest'))
        assert res.status_code == 200
        assert len(res.json['data']) == 0

    def test_bad_role(self, testapp, user):
        """Test that you can only specify 'guest' or 'host' as a role."""
        self.login(user, testapp)
        res = testapp.get(self.base_url.format('somethingelse'), status=400)
        assert res.status_code == 400
