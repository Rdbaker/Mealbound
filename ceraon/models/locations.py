# -*- coding: utf-8 -*-
"""Models for locations."""
from geopy.geocoders import Nominatim
from sqlalchemy.dialects.postgresql import JSONB

from ceraon.database import Column, UUIDModel, db, relationship


class Location(UUIDModel):
    """Either a user's location (internal) or an external location."""

    __tablename__ = 'location'

    # specifies the source of the location. `None` means that it was made
    # in-house. If the location has an external source, the raw data will be
    # found in raw_<source name>_data and the source id will be found in
    # <source>_id
    source = Column(db.String(255), index=True)

    # data from Yelp
    raw_yelp_data = Column(JSONB)
    yelp_id = Column(db.String(255), index=True, nullable=True, unique=True)

    # an internal location doesn't need a name, as it's linked to a user
    name = Column(db.String(255), nullable=True)

    # price_class is a rough estimate of the price, it's a scale from 1 to n
    # where 1 is "very inexpensive" and n is "you can't get more expensive"
    price_class = Column(db.Integer(), index=True)

    # the average price of the meal at this location (if known)
    avg_price = Column(db.Float(), index=True)

    # eventually these will be converted and pulled into PostGIS fields.. but
    # not for now
    latitude = Column(db.Float())
    longitude = Column(db.Float())

    # the address, as a string, of the location
    address = Column(db.String(255), nullable=True)

    phone = Column(db.String(50))

    meals = relationship('Meal', cascade='delete')

    def __repr__(self):
        """Return the location as a string."""
        return '<Location({name} | {id})>'.format(name=self.name, id=self.id)

    def update_coordinates(self):
        """Set the coordinates based on the current address."""
        self.latitude, self.longitude = self.geocode_coordinates_from_address()
        self.save()

    def geocode_coordinates_from_address(self):
        """Invoke the geocoder and attempt to find the corrdinates."""
        try:
            geolocator = Nominatim()
            address, (lat, lon) = geolocator.geocode(self.address)
        except:
            lat, lon = None, None
        return lat, lon
