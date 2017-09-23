# -*- coding: utf-8 -*-
"""Models for meals."""
import datetime as dt

from flask_login import current_user
from sqlalchemy import Time, and_, cast

from ceraon.database import (Column, Model, UUIDModel, db, reference_col,
                             relationship)
from ceraon.models.tags import Tag, MealTag


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
    scheduled_for = Column(db.DateTime(timezone=True), nullable=False,
                           default=dt.datetime.utcnow)

    location_id = reference_col('location', nullable=False)
    location = relationship('Location')

    price = Column(db.Float(), nullable=False)

    user_meals = relationship('UserMeal', cascade='delete')

    num_reviews = Column(db.Integer(), default=0)
    avg_rating = Column(db.Float())

    max_guests = Column(db.Integer())
    meal_tags = relationship('MealTag', cascade='delete')

    @property
    def host(self):
        """Get the host of the meal."""
        return self.location.host

    @property
    def num_guests(self):
        """Get the count of the guests."""
        return len(self.user_meals)

    @property
    def tags(self):
        """Get the tags for the meal."""
        if self.meal_tags:
            return [mt.tag for mt in self.meal_tags]
        else:
            return []

    @tags.setter
    def tags(self, newtags):
        """Set the tags on the meal, deleting the old tags.

        :param newtags [{'id': int}]: the list of tag IDs to update the meal
        """
        tags = [Tag.find(t.get('id')) for t in newtags]
        if any([t is None for t in tags]):
            raise RuntimeError('Tag not found')
        for mt in self.meal_tags:
            mt.delete()
        for t in tags:
            MealTag.create(meal=self, tag=t)

    @property
    def my_review(self):
        """Get the review of the currently logged-in user."""
        if not current_user.is_authenticated:
            return None
        review = filter(
            lambda r: r.user_id == current_user.id and r.meal_id == self.id,
            self.reviews)
        try:
            return next(review)
        except StopIteration:
            return None

    def update_reviews(self):
        """Update the reviews columns based on the latest reviews."""
        if len(self.reviews) == 0:
            return
        self.update(
            num_reviews=len(self.reviews),
            avg_rating=sum([r.rating for r in self.reviews])/len(self.reviews)
        )

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
        elif self.scheduled_for < dt.datetime.now().astimezone():
            return False
        return True

    def is_host(self, user):
        """Returns whether or not the given user is the host."""
        return user.id == self.host.id

    def is_guest(self, user):
        """Returns whether or not the given user is a guest."""
        return user.id in [um.user.id for um in self.user_meals]

    def is_upcoming(self):
        """Returns whether or not the meal is upcoming."""
        return self.scheduled_for >= dt.datetime.now().astimezone()

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
        return query.filter(cls.scheduled_for >=
                            dt.datetime.now().astimezone())

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
