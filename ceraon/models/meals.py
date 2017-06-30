# -*- coding: utf-8 -*-
"""Models for meals."""
import datetime as dt

from sqlalchemy import Time, and_, cast

from ceraon.database import (Column, Model, UUIDModel, db, reference_col,
                             relationship)


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
    description = Column(db.Text)

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

    @property
    def num_guests(self):
        """Get the count of the guests."""
        return len(self.user_meals)

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
        """Returns whether or not the given user is the host."""
        return user is self.host

    def is_upcoming(self):
        """Returns whether or not the meal is upcoming."""
        return self.scheduled_for >= dt.datetime.utcnow()

    @classmethod
    def upcoming(cls):
        """Returns a query of the meals that have yet to happen."""
        return cls.upcoming_filter(cls.query)

    @classmethod
    def breakfast(cls):
        """Returns a query for breakfast."""
        return cls.breakfast_filter(cls.query)

    @classmethod
    def lunch(cls):
        """Returns a query for lunch."""
        return cls.lunch_filter(cls.query)

    @classmethod
    def dinner(cls):
        """Returns a query for dinner."""
        return cls.dinner_filter(cls.query)

    @classmethod
    def upcoming_filter(cls, query):
        """Apply an "after now" filter to the meal query that was passed in.

        :param query flask_sqlalchemy.BaseQuery: The query to apply the filter
            to.

        :return flask_sqlalchemy.BaseQuery:
        """
        return query.filter(cls.scheduled_for >= dt.datetime.utcnow())

    @classmethod
    def breakfast_filter(cls, query):
        """Apply a breakfast filter to the meal query that was passed in.

        :param query flask_sqlalchemy.BaseQuery: The query to apply the filter
            to.

        :return flask_sqlalchemy.BaseQuery:
        """
        return query.filter(and_(
            cast(cls.scheduled_for, Time) >= dt.time(5, 0, 0),
            cast(cls.scheduled_for, Time) < dt.time(12, 0, 0)))

    @classmethod
    def lunch_filter(cls, query):
        """Apply a lunch filter to the meal query that was passed in.

        :param query flask_sqlalchemy.BaseQuery: The query to apply the filter
            to.

        :return flask_sqlalchemy.BaseQuery:
        """
        return query.filter(and_(
            cast(cls.scheduled_for, Time) >= dt.time(11, 0, 0),
            cast(cls.scheduled_for, Time) < dt.time(15, 0, 0)))

    @classmethod
    def dinner_filter(cls, query):
        """Apply a dinner filter to the meal query that was passed in.

        :param query flask_sqlalchemy.BaseQuery: The query to apply the filter
            to.

        :return flask_sqlalchemy.BaseQuery:
        """
        return query.filter(and_(
            cast(cls.scheduled_for, Time) >= dt.time(16, 0, 0),
            cast(cls.scheduled_for, Time) < dt.time(23, 0, 0)))
