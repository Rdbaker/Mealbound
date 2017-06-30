# -*- coding: utf-8 -*-
"""Defines fixtures available to all tests."""
from datetime import datetime as dt

import pytest
from webtest import TestApp

from ceraon.app import create_app
from ceraon.database import db as _db
from ceraon.models.meals import UserMeal
from ceraon.settings import TestConfig

from .factories import LocationFactory, MealFactory, UserFactory


@pytest.yield_fixture(scope='function')
def app():
    """An application for the tests."""
    _app = create_app(TestConfig)
    ctx = _app.test_request_context()
    ctx.push()

    yield _app

    ctx.pop()


@pytest.fixture(scope='function')
def testapp(app):
    """A Webtest app."""
    return TestApp(app)


@pytest.yield_fixture(scope='function')
def db(app):
    """A database for the tests."""
    _db.app = app
    with app.app_context():
        _db.create_all()

    yield _db

    # Explicitly close DB connection
    _db.session.close()
    _db.drop_all()


@pytest.fixture
def user(db):
    """A user for the tests."""
    user = UserFactory()
    db.session.commit()
    return user


@pytest.fixture
def host(db):
    """A user to host the location and meal."""
    user = UserFactory()
    db.session.commit()
    return user


@pytest.fixture
def location(db):
    """A location for the tests."""
    location = LocationFactory()
    db.session.commit()
    return location


@pytest.fixture
def hosted_location(location, host):
    """A location with a host."""
    host.location = location
    host.save()
    location.save()
    return location


@pytest.fixture
def meal(db, hosted_location):
    """A meal for the tests."""
    meal = MealFactory(location=hosted_location)
    db.session.commit()
    return meal


@pytest.fixture
def past_meal(meal):
    """A meal in the past."""
    meal.scheduled_for = dt.now()
    meal.save()
    return meal


@pytest.fixture
def guest(user, meal):
    """A guest for a meal."""
    um = UserMeal(user=user, meal=meal)
    um.save()
    return user


@pytest.fixture
def guest_location(guest):
    """A location for the guest."""
    location = LocationFactory()
    location.save()
    guest.location = location
    guest.save()
    return location
