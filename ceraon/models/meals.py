# -*- coding: utf-8 -*-
"""Models for meals."""
import datetime as dt

from sqlalchemy.orm import backref

from ceraon.database import (UUIDModel, Column, db, relationship, reference_col,
                             Model)


class UserMeal(Model):
    """This is an entry for a user <-> meal join."""

    __tablename__ = 'user_meal'

    user_id = reference_col('users', primary_key=True)
    user = relationship('User')
    meal_guid = reference_col('meal', primary_key=True)
    meal = relationship('Meal')


class Meal(UUIDModel):
    """A meal that occurs at a location (internal only)."""

    __tablename__ = 'meal'

    # ALL TIMES ARE IN UTC
    scheduled_for = Column(db.DateTime, nullable=False,
                           default=dt.datetime.utcnow)

    location_id = reference_col('location', nullable=False)
    location = relationship('Location', backref=backref('meals'),
                            cascade='delete')

    price = Column(db.Float(), nullable=False)

    user_meals = relationship('UserMeal', cascade='delete')

    @property
    def host(self):
        """Get the host of the meal."""
        return self.location.host

    def joined(self, user):
        """Return True if the given user has joined the meal already."""
        for um in self.user_meals:
            if um.user == user:
                return True
        return False
