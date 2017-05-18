# -*- coding: utf-8 -*-
"""Models for locations."""
from sqlalchemy.dialects.postgresql import JSONB

from ceraon.database import UUIDModel, Column, db


class Location(UUIDModel):
    __tablename__ = 'location'

    # specifies the source of the location. `None` means that it was made
    # in-house. If the location has an external source, the raw data will be
    # found in raw_<source name>_data and the source id will be found in
    # <source>_id
    source = Column(db.String(255), index=True)

    # data from Yelp
    raw_yelp_data = Column(JSONB)
    yelp_id = Column(db.String(255), index=True, nullable=True, unique=True)

    name = Column(db.String(255), nullable=False)

    # price_class is a rough estimate of the price, it's a scale from 1 to n
    # where 1 is "very inexpensive" and n is "you can't get more expensive"
    price_class = Column(db.Integer(), index=True)

    # the exact price of the meal at this location (if known)
    exact_price = Column(db.Integer(), index=True)

    # eventually these will be converted and pulled into PostGIS fields.. but
    # not for now
    latitude = Column(db.Float())
    longitude = Column(db.Float())

    phone = Column(db.String(50))

    def __repr__(self):
        return '<Location({name} | {id})>'.format(name=self.name, id=self.id)
