# -*- coding: utf-8 -*-
"""Defines fixtures available to all tests."""
from datetime import datetime as dt
from datetime import timedelta as td

import pytest
from webtest import TestApp

from ceraon.app import create_app
from ceraon.database import db as _db
from ceraon.models.meals import UserMeal
from ceraon.settings import TestConfig

from .factories import (LocationFactory, MealFactory, ReviewFactory,
                        UserFactory, TagFactory, TransactionFactory)


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
    meal.scheduled_for = dt.now().astimezone() - td(days=1)
    meal.save()
    return meal


@pytest.fixture
def past_guest(user, past_meal):
    """A guest from a meal in the past."""
    um = UserMeal(user=user, meal=past_meal)
    um.save()
    return user


@pytest.fixture
def review(past_guest, past_meal):
    """A review from a guest."""
    review = ReviewFactory(user=past_guest, meal=past_meal)
    review.save()
    return review


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


@pytest.fixture
def transaction(host, guest, meal):
    """A transaction for the tests."""
    transaction = TransactionFactory(meal=meal, payer=guest, payee=host)
    transaction.save()
    return transaction


@pytest.fixture
def tag_one():
    """A tag for the tests."""
    tag = TagFactory()
    tag.save()
    return tag
