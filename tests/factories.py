# -*- coding: utf-8 -*-
"""Factories to help in tests."""
import random
from datetime import datetime as dt
from datetime import timedelta as td

from factory import PostGenerationMethodCall, Sequence
from factory.alchemy import SQLAlchemyModelFactory

from ceraon.database import db
from ceraon.models.locations import Location
from ceraon.models.meals import Meal
from ceraon.models.reviews import Review
from ceraon.models.tags import Tag
from ceraon.models.transactions import Transaction
from ceraon.user.models import User


class BaseFactory(SQLAlchemyModelFactory):
    """Base factory."""

    class Meta:
        """Factory configuration."""

        abstract = True
        sqlalchemy_session = db.session


class UserFactory(BaseFactory):
    """User factory."""

    email = Sequence(lambda n: 'user{0}@example.com'.format(n))
    password = PostGenerationMethodCall('set_password', 'example')
    active = True
    first_name = Sequence(lambda n: 'user {0} first name'.format(n))
    last_name = Sequence(lambda n: 'user {0} last name'.format(n))

    class Meta:
        """Factory configuration."""

        model = User


class LocationFactory(BaseFactory):
    """Location factory."""

    name = Sequence(lambda n: 'location {0}'.format(n))
    address = Sequence(lambda n: 'location address {0}'.format(n))

    class Meta:
        """Factory configuration."""

        model = Location


class MealFactory(BaseFactory):
    """Meal factory."""

    price = round(float(random.random() * random.random() * 10), 2)
    scheduled_for = dt.now() + td(days=1)
    name = Sequence(lambda n: 'meal {0}'.format(n))

    class Meta:
        """Factory configuration."""

        model = Meal


class ReviewFactory(BaseFactory):
    """Review factory."""

    rating = random.choice([x/2 for x in range(11)])
    created_at = dt.now()
    description = Sequence(lambda n: 'review{0}'.format(n))

    class Meta:
        """Factory configuration."""

        model = Review


class TransactionFactory(BaseFactory):
    """Transaction factory."""

    # at least $0.31, which is the amount we can charge for our stripe overhead
    # outcome to be $0
    amount = max(round(float(random.random() * random.random() * 10), 2), 0.31)

    class Meta:
        """Factory configuration."""

        model = Transaction


class TagFactory(BaseFactory):
    """Tag factory."""

    title = Sequence(lambda n: 'tag{0}'.format(n))
    alias = Sequence(lambda n: 'tag{0}'.format(n))

    class Meta:
        """Factory configuration."""

        model = Tag
