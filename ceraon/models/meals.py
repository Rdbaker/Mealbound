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

    name = Column(db.String(255), nullable=False)
    description = Column(db.String(255), nullable=False)
    
    # ALL TIMES ARE IN UTC
    scheduled_for = Column(db.DateTime, nullable=False,
                           default=dt.datetime.utcnow)

    location_id = reference_col('location', nullable=False)
    location = relationship('Location')

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

    def user_can_join(self, user):
        """Decide whether or not the user can join the meal."""
        if not user.is_authenticated:
            return False
        elif self.is_host(user):
            return False
        elif self.joined(user):
            return False
        elif self.scheduled_for < dt.datetime.now():
            return False
        return True
    
    def is_host(self, user):
        """Returns whether or not the given user is the host"""
        return user is self.host

    def is_upcoming(self):
        """Returns whether or not the meal is upcoming"""
        return self.scheduled_for >= dt.datetime.now()

