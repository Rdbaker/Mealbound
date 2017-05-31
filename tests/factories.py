# -*- coding: utf-8 -*-
"""Factories to help in tests."""
from datetime import datetime as dt, timedelta as td
import random

from factory import PostGenerationMethodCall, Sequence
from factory.alchemy import SQLAlchemyModelFactory

from ceraon.database import db
from ceraon.user.models import User
from ceraon.models.locations import Location
from ceraon.models.meals import Meal


class BaseFactory(SQLAlchemyModelFactory):
    """Base factory."""

    class Meta:
        """Factory configuration."""

        abstract = True
        sqlalchemy_session = db.session


class UserFactory(BaseFactory):
    """User factory."""

    username = Sequence(lambda n: 'user{0}'.format(n))
    email = Sequence(lambda n: 'user{0}@example.com'.format(n))
    password = PostGenerationMethodCall('set_password', 'example')
    active = True

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
