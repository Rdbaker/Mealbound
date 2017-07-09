# -*- encoding: utf-8 -*-
"""Test the views at /api/v1/reviews."""

import uuid

import pytest

from ceraon.models.reviews import Review
from tests.utils import BaseViewTest


@pytest.mark.usefixtures('db')
class TestFindReview(BaseViewTest):
    """Test GET /api/v1/reviews/ID."""

    base_url = '/api/v1/reviews/{}'

    def test_nonexistent_get(self, testapp):
        """Test the a nonexistent get returns a 404."""
        res = testapp.get(self.base_url.format(uuid.uuid4()), status=404)
        assert res.status_code == 404
        assert 'error_code' in res.json
        assert 'error_message' in res.json

    def test_successful_get(self, testapp, review):
        """Test that a normal GET works just fine."""
        res = testapp.get(self.base_url.format(review.id))
        assert res.status_code == 200
        data = res.json['data']
        assert 'reviewer' in data
        assert 'description' in data
        assert 'rating' in data
        assert 'meal' in data


@pytest.mark.usefixtures('db')
class TestCreateReview(BaseViewTest):
    """Test POST /api/v1/reviews."""

    endpoints = [
        '/api/v1/reviews?meal_id={}',
        '/api/v1/meals/{}/reviews'
    ]

    def setup_method(self, method):
        """Set up the test class. Pytest will call this for us."""
        self.valid_data = {
            'description': 'this is my description',
            'rating': 4.0,
        }

    @pytest.mark.parametrize('endpoint', endpoints)
    def test_unauthenticated_create(self, testapp, past_meal, endpoint):
        """Test that we get a 401 if the user is not authenticated."""
        url = endpoint.format(past_meal.id)
        res = testapp.post_json(url, self.valid_data, status=401)
        assert res.status_code == 401

    @pytest.mark.parametrize('endpoint', endpoints)
    def test_meal_not_joined(self, testapp, endpoint, user, past_meal):
        """Test that we get a 403 if we didn't join the meal."""
        self.login(user, testapp)
        url = endpoint.format(past_meal.id)
        res = testapp.post_json(url, self.valid_data, status=403)
        assert res.status_code == 403
        assert 'error_code' in res.json
        assert 'error_message' in res.json

    @pytest.mark.parametrize('endpoint', endpoints)
    def test_meal_in_future(self, testapp, endpoint, user, meal):
        """Test that we get a 428 if the meal hasn't happened yet."""
        self.login(user, testapp)
        url = endpoint.format(meal.id)
        res = testapp.post_json(url, self.valid_data, status=428)
        assert res.status_code == 428
        assert 'error_code' in res.json
        assert 'error_message' in res.json

    @pytest.mark.parametrize('endpoint', endpoints)
    def test_guest_can_review(self, testapp, endpoint, past_guest, past_meal):
        """Test that a guest can review the meal just fine."""
        self.login(past_guest, testapp)
        url = endpoint.format(past_meal.id)
        res = testapp.post_json(url, self.valid_data)
        assert res.status_code == 201
        assert 'data' in res.json
        assert 'message' in res.json
        data = res.json['data']
        assert 'reviewer' in data
        assert 'description' in data
        assert 'rating' in data
        assert 'meal' in data

    @pytest.mark.parametrize('endpoint', endpoints)
    def test_review_needs_description(self, testapp, endpoint, past_guest,
                                      past_meal):
        """Test that a review needs a description."""
        del self.valid_data['description']
        self.login(past_guest, testapp)
        url = endpoint.format(past_meal.id)
        res = testapp.post_json(url, self.valid_data, status=422)
        assert 'description' in res.json['error_message']

    @pytest.mark.parametrize('endpoint', endpoints)
    def test_review_needs_rating(self, testapp, endpoint, past_guest,
                                 past_meal):
        """Test that a review needs a rating."""
        del self.valid_data['rating']
        self.login(past_guest, testapp)
        url = endpoint.format(past_meal.id)
        res = testapp.post_json(url, self.valid_data, status=422)
        assert 'rating' in res.json['error_message']

    @pytest.mark.parametrize('endpoint', endpoints)
    def test_reivew_rating_positive(self, testapp, endpoint, past_guest,
                                    past_meal):
        """Test that a review needs a positive rating."""
        self.valid_data['rating'] = -1.5
        self.login(past_guest, testapp)
        url = endpoint.format(past_meal.id)
        res = testapp.post_json(url, self.valid_data, status=422)
        assert 'rating' in res.json['error_message']

    @pytest.mark.parametrize('endpoint', endpoints)
    def test_reivew_rating_interval(self, testapp, endpoint, past_guest,
                                    past_meal):
        """Test that a review needs a rating divisible by 0.5."""
        self.valid_data['rating'] = 1.7
        self.login(past_guest, testapp)
        url = endpoint.format(past_meal.id)
        res = testapp.post_json(url, self.valid_data, status=422)
        assert 'rating' in res.json['error_message']






@pytest.mark.usefixtures('db')
class TestUpdateReview(BaseViewTest):
    """Test PATCH /api/v1/reviews/UUID."""

    base_url = '/api/v1/reviews/{}'

    def setup_method(self, method):
        """Set up the test class. Pytest will call this for us."""
        self.valid_data = {
            'description': 'this is my description',
            'rating': 4.0,
        }

    def test_unauthenticated(self, testapp, review):
        """Test that unauthenticated gets a 401."""
        res = testapp.patch_json(self.base_url.format(review.id),
                                 self.valid_data, status=401)
        assert res.status_code == 401

    def test_no_review_found(self, testapp, guest):
        """Test that a nonexistent review gets a 404."""
        self.login(guest, testapp)
        res = testapp.patch_json(self.base_url.format(uuid.uuid4()),
                                 self.valid_data, status=404)
        assert res.status_code == 404

    def test_unauthorized(self, testapp, host, review):
        """Test that unauthorized gets a 403."""
        self.login(host, testapp)
        res = testapp.patch_json(self.base_url.format(review.id),
                                 self.valid_data, status=403)
        assert res.status_code == 403

    def test_update_works(self, testapp, past_guest, review):
        """Test that updating a review works."""
        self.login(past_guest, testapp)
        res = testapp.patch_json(self.base_url.format(review.id),
                                 self.valid_data)
        assert res.status_code == 202
        assert review.rating == self.valid_data['rating']

    def test_partial_update_works(self, testapp, past_guest, review):
        """Test that only partially updating a review works."""
        self.login(past_guest, testapp)
        res = testapp.patch_json(self.base_url.format(review.id),
                                 {'rating': 4.00})
        assert res.status_code == 202
        assert review.rating == 4.00


@pytest.mark.usefixtures('db')
class TestReplaceReview(BaseViewTest):
    """Test PUT /api/v1/reviews/UUID."""

    base_url = '/api/v1/reviews/{}'

    def setup_method(self, method):
        """Set up the test class. Pytest will call this for us."""
        self.valid_data = {
            'description': 'this is my description',
            'rating': 4.0,
        }

    def test_unauthenticated(self, testapp, review):
        """Test that unauthenticated gets a 401."""
        res = testapp.put_json(self.base_url.format(review.id),
                               self.valid_data, status=401)
        assert res.status_code == 401

    def test_no_review_found(self, testapp, guest):
        """Test that a nonexistent review gets a 404."""
        self.login(guest, testapp)
        res = testapp.put_json(self.base_url.format(uuid.uuid4()),
                               self.valid_data, status=404)
        assert res.status_code == 404

    def test_unauthorized(self, testapp, review, host):
        """Test that unauthorized gets a 403."""
        self.login(host, testapp)
        res = testapp.put_json(self.base_url.format(review.id),
                               self.valid_data, status=403)
        assert res.status_code == 403

    def test_replace_works(self, testapp, past_guest, review):
        """Test that replacing a review works."""
        self.login(past_guest, testapp)
        res = testapp.put_json(self.base_url.format(review.id),
                               self.valid_data)
        assert res.status_code == 202
        assert review.rating == self.valid_data['rating']

    def test_partial_replace_fails(self, testapp, past_guest, review):
        """Test that only partially replacing a review fails."""
        self.login(past_guest, testapp)
        res = testapp.put_json(self.base_url.format(review.id),
                               {'rating': 4.00}, status=422)
        assert res.status_code == 422
        assert 'description' in res.json['error_message']


@pytest.mark.usefixtures('db')
class TestDestroyReview(BaseViewTest):
    """Test DELETE /api/v1/reviews/UUID."""

    base_url = '/api/v1/reviews/{}'

    def test_unauthenticated(self, testapp, review):
        """Test that unauthenticated gets a 401."""
        res = testapp.delete(self.base_url.format(review.id), status=401)
        assert res.status_code == 401

    def test_review_not_found(self, testapp, user):
        """Test that a review not found gets a 404."""
        self.login(user, testapp)
        res = testapp.delete(self.base_url.format(uuid.uuid4()), status=404)
        assert res.status_code == 404

    def test_not_reviewer(self, testapp, host, review):
        """Test that not being the reviewer gets a 403."""
        self.login(host, testapp)
        res = testapp.delete(self.base_url.format(review.id), status=403)
        assert res.status_code == 403

    def test_review_deleted(self, testapp, past_guest, review):
        """Test that a reviewer can delete a meal."""
        self.login(past_guest, testapp)
        res = testapp.delete(self.base_url.format(review.id))
        assert res.status_code == 204
        try_find_review = Review.find(review.id)
        assert try_find_review is None


@pytest.mark.usefixtures('db')
class TestGetMyReviews(BaseViewTest):
    """Test GET /api/v1/reviews/mine/<role>."""

    base_url = '/api/v1/reviews/mine/{}'

    def test_unauthenticated(self, testapp, review):
        """Test that an unauthenticated user gets a 401."""
        res = testapp.get(self.base_url.format('guest'), status=401)
        assert res.status_code == 401

    def test_see_reviewed_meals(self, testapp, past_guest, review):
        """Test that a user can see the reviews they wrote."""
        self.login(past_guest, testapp)
        res = testapp.get(self.base_url.format('guest'))
        assert res.status_code == 200
        assert res.json['data'][0]['id'] == str(review.id)
        assert len(res.json['data']) == 1

    def test_see_hosted_reviews(self, testapp, host, review):
        """Test that a user can see the reviews for meals they host."""
        self.login(host, testapp)
        res = testapp.get(self.base_url.format('host'))
        assert res.status_code == 200
        assert res.json['data'][0]['id'] == str(review.id)
        assert len(res.json['data']) == 1

    def test_see_hosts_reviewed_meals(self, testapp, host, review):
        """Check that the host has reviewed no meals... just a sanity check."""
        self.login(host, testapp)
        res = testapp.get(self.base_url.format('guest'))
        assert res.status_code == 200
        assert len(res.json['data']) == 0

    def test_bad_role(self, testapp, user):
        """Test that you can only specify 'guest' or 'host' as a role."""
        self.login(user, testapp)
        res = testapp.get(self.base_url.format('somethingelse'), status=400)
        assert res.status_code == 400
