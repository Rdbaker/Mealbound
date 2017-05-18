"""Test the Location models."""
import pytest

from ceraon.api.locations.models import Location

@pytest.mark.usefixtures('db')
class TestLocation:
    """Location tests."""

    def test_get_by_id(self):
        """Get Location by uuid."""
        location = Location(name='my location')
        location.save()

        retrieved = Location.find(location.id)
        assert retrieved == location
