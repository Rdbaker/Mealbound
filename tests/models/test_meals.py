"""Test the Meal models."""
import pytest

from ceraon.models.meals import Meal


@pytest.mark.usefixtures('db')
class TestMeal:
    """Meal tests."""

    def test_get_by_id(self, location):
        """Get Meal by uuid."""
        meal = Meal(location=location, price=0)
        meal.save()

        retrieved = Meal.find(meal.id)
        assert retrieved == meal

    def test_meal_host_is_location_host(self, meal):
        """Test that a meal's host is its location's host."""
        assert meal.host == meal.location.host

    def test_any_user_can_join(self, meal, user):
        """Test that a user who has not joined a meal can join a meal."""
        print(meal.scheduled_for)
        print(meal.host == user)
        assert meal.user_can_join(user)

    def test_cannot_join_in_past(self, past_meal, user):
        """Test that a user cannot join a meal in the past."""
        assert not past_meal.user_can_join(user)

    def test_host_cannot_join(self, meal):
        """Test that a meal host cannot join the meal."""
        assert not meal.user_can_join(meal.host)

    def test_guest_cannot_join(self, guest):
        """Test that a guest cannot join a meal again."""
        meal = guest.user_meals[0].meal
        assert not meal.user_can_join(guest)

    def test_guest_joined_meal(self, guest):
        """Test that joined returns True for a user that joined a meal."""
        meal = guest.user_meals[0].meal
        assert meal.joined(guest)

    def test_user_not_joined(self, meal, user):
        """Test that joined returns False for some other user."""
        assert not meal.joined(user)
