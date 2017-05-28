"""Test the Location models."""
import pytest

from ceraon.models.locations import Location


@pytest.mark.usefixtures('db')
class TestLocation:
    """Location tests."""

    def test_get_by_id(self):
        """Get Location by uuid."""
        location = Location(name='my location', address='my address')
        location.save()

        retrieved = Location.find(location.id)
        assert retrieved == location
