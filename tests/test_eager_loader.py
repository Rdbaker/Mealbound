# -*- coding: utf-8 -*-
"""Test the eager loader."""

import uuid
import json

from bs4 import BeautifulSoup
import pytest

from ceraon.api.v1.meals.schema import MealSchema
from ceraon.api.v1.users.schema import UserSchema


class EagerLoaderTestCase:
    """A base test case for the eager loader tests."""

    entity_class = 'embed_class'
    entity_id = 'embed_id'
    embed_fields = 'embed_fields'

    @classmethod
    def get_embedded_content(cls, res):
        """Get the embedded content from a testapp response.

        :param res object: The response object from a request
        """
        soup = BeautifulSoup(res.body, 'html.parser')
        elt = soup.find('meta', attrs={'name': 'embed-entity'})
        return json.loads(elt['content'])


@pytest.mark.usefixtures('db')
class TestEagerLoaderUser(EagerLoaderTestCase):
    """Test that a request with ?entity_class=user gets processed correctly."""

    def test_user_not_found(self, testapp):
        """Test that a user not found returns null."""
        res = testapp.get('/?{cls}=user&{uid}=1&{fields}=id'
                          .format(cls=self.entity_class,
                                  uid=self.entity_id,
                                  fields=self.embed_fields))
        assert self.get_embedded_content(res) is None

    def test_user_trivial(self, testapp, user):
        """Test that asking for the ID returns just that."""
        expected = UserSchema(only=('id',)).dumps(user).data
        res = testapp.get('/?{cls}=user&{uid}={user_id}&{fields}=id'
                          .format(cls=self.entity_class,
                                  uid=self.entity_id,
                                  fields=self.embed_fields,
                                  user_id=user.id))
        assert expected == json.dumps(self.get_embedded_content(res))

    def test_user_no_fields(self, testapp, user):
        """Test that the user returns data if no fields are specified."""
        res = testapp.get('/?{cls}=user&{uid}={user_id}'
                          .format(cls=self.entity_class,
                                  uid=self.entity_id,
                                  user_id=user.id))
        user_data = self.get_embedded_content(res)
        assert 'id' in user_data
        assert 'first_name' in user_data
        assert 'last_name' in user_data
        assert 'public_name' in user_data
        assert 'created_at' in user_data
        assert 'image_url' in user_data

    def test_user_no_private_fields(self, testapp, user):
        """Test that you can't get private fields from the embedded user."""
        res = testapp.get('/?{cls}=user&{uid}={user_id}'
                          .format(cls=self.entity_class,
                                  uid=self.entity_id,
                                  user_id=user.id))
        user_data = self.get_embedded_content(res)
        for field in UserSchema.private_fields:
            assert field not in user_data

    def test_user_unknown_fields(self, testapp, user):
        """Test that you ask for a field that doesn't exist."""
        res = testapp.get('/?{cls}=user&{uid}={user_id}&{fields}=fake'
                          .format(cls=self.entity_class,
                                  uid=self.entity_id,
                                  fields=self.embed_fields,
                                  user_id=user.id))
        assert self.get_embedded_content(res) is None


@pytest.mark.usefixtures('db')
class TestEagerLoaderMeal(EagerLoaderTestCase):
    """Test that a request with ?entity_class=meal gets processed correctly."""

    def test_meal_not_found(self, testapp):
        """Test that a meal not found returns null."""
        res = testapp.get('/?{cls}=meal&{uid}={meal_id}&{fields}=id'
                          .format(cls=self.entity_class,
                                  uid=self.entity_id,
                                  meal_id=uuid.uuid4(),
                                  fields=self.embed_fields))
        assert self.get_embedded_content(res) is None

    def test_meal_trivial(self, testapp, meal):
        """Test that asking for the ID returns just that."""
        expected = MealSchema(only=('id',)).dumps(meal).data
        res = testapp.get('/?{cls}=meal&{uid}={meal_id}&{fields}=id'
                          .format(cls=self.entity_class,
                                  uid=self.entity_id,
                                  fields=self.embed_fields,
                                  meal_id=meal.id))
        assert expected == json.dumps(self.get_embedded_content(res))

    def test_meal_no_fields(self, testapp, meal):
        """Test that the meal returns data if no fields are specified."""
        res = testapp.get('/?{cls}=meal&{uid}={meal_id}'
                          .format(cls=self.entity_class,
                                  uid=self.entity_id,
                                  meal_id=meal.id))
        meal_data = self.get_embedded_content(res)
        assert 'id' in meal_data
        assert 'host' in meal_data
        assert 'scheduled_for' in meal_data
        assert 'price' in meal_data
        assert 'name' in meal_data
        assert 'description' in meal_data
        assert 'email' not in meal_data['host']
