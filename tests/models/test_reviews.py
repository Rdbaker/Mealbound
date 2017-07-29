"""Test the Review models."""
import pytest

from ceraon.models.reviews import Review


@pytest.mark.usefixtures('db')
class TestReview:
    """Review tests."""

    def test_get_by_id(self, meal, guest):
        """Get review by id."""
        review = Review(user=guest, meal=meal, rating=4.0,
                        description='this is my review')
        review.save()
        retrieved = Review.find(review.id)
        assert retrieved == review

    def test_bad_rating_raises_error(self, review):
        """Test that a bad `rating` raises an error."""
        with pytest.raises(AssertionError):
            review.rating = -2
        with pytest.raises(AssertionError):
            review.rating = 10
