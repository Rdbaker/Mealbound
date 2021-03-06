# -*- coding: utf-8 -*-
"""User models."""
import datetime as dt

from facebook import GraphAPI
from flask import current_app
from flask_login import UserMixin
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import BadSignature, SignatureExpired
from sqlalchemy.orm import backref

from ceraon.database import (Column, Model, SurrogatePK, db, reference_col,
                             relationship)
from ceraon.extensions import bcrypt
from ceraon.models import locations, meals, reviews
from ceraon.utils import FlaskThread, get_fb_access_token


class Role(SurrogatePK, Model):
    """A role for a user."""

    __tablename__ = 'roles'
    name = Column(db.String(80), unique=True, nullable=False)
    user_id = reference_col('users', nullable=True)
    user = relationship('User', backref='roles')

    def __init__(self, name, **kwargs):
        """Create instance."""
        db.Model.__init__(self, name=name, **kwargs)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<Role({name})>'.format(name=self.name)


class User(UserMixin, SurrogatePK, Model):
    """A user of the app."""

    __tablename__ = 'users'

    # External API identifiers
    facebook_id = Column(db.String(80), unique=True, nullable=True, index=True)
    stripe_customer_id = Column(db.String(80), unique=True, nullable=True,
                                index=True)

    email = Column(db.String(80), unique=True, nullable=False)
    #: The hashed password
    password = Column(db.Binary(128), nullable=True)
    created_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)
    first_name = Column(db.String(50), nullable=False)
    last_name = Column(db.String(50), nullable=False)
    active = Column(db.Boolean(), default=False)
    is_admin = Column(db.Boolean(), default=False)

    location_id = reference_col('location', nullable=True)
    location = relationship('Location', backref=backref('host', uselist=False),
                            cascade='delete')

    user_meals = relationship('UserMeal', cascade='delete')

    def __init__(self, email, password=None, **kwargs):
        """Create instance."""
        db.Model.__init__(self, email=email, **kwargs)
        if password:
            self.set_password(password)
        else:
            self.password = None

    @classmethod
    def create(cls, **kwargs):
        """Create the new user."""
        newUser = super(Model, cls).create(**kwargs)
        # Auto create location for user
        locations.Location.create(host=newUser, name=newUser.public_name)
        return newUser

    def set_password(self, password):
        """Set password."""
        self.password = bcrypt.generate_password_hash(password)

    def check_password(self, value):
        """Check password."""
        return bcrypt.check_password_hash(self.password, value)

    # Adapted from
    # https://blog.miguelgrinberg.com/post/restful-authentication-with-flask
    def get_auth_token(self, expiration=600):
        """Retrieve a signed auth token for the user."""
        serializer = Serializer(current_app.config['SECRET_KEY'],
                                expires_in=expiration)
        return serializer.dumps({'userId': self.id})

    @staticmethod
    def verify_auth_token(token):
        """Return the User from an auth token."""
        serializer = Serializer(current_app.config['SECRET_KEY'])
        try:
            tokenData = serializer.loads(token)
        except SignatureExpired:
            return None
        except BadSignature:
            return None
        user = User.get_by_id(tokenData['userId'])
        return user

    @property
    def full_name(self):
        """Full user name."""
        return '{0} {1}'.format(self.first_name, self.last_name)

    @property
    def username(self):
        """DEPRECATED: please use `user.public_name` instead."""
        import warnings
        warnings.warn('The `username` property has been deprecated.'
                      ' Please use the `public_name` property instead.')
        return self.public_name

    @property
    def public_name(self):
        """Return <first name> <last initial> of the user.

        example usage:
            >>> u = user(first_name='Ryan', last_name='Baker')
            >>> u.public_name
            u'Ryan B.'
        """
        if self.last_name is not None and len(self.last_name) > 0:
            return '{} {}.'.format(self.first_name, self.last_name[0])
        else:
            return self.first_name

    @property
    def image_url(self):
        """Get the image url from facebook if available."""
        if not self.facebook_id:
            return None
        try:
            fb = GraphAPI(access_token=get_fb_access_token(), version='2.9')
            res = fb.get_object(id=self.facebook_id, fields='picture')
            url = res.get('picture', {}).get('data', {}).get('url')
        except:
            # we might not be able to connect to FB for some reason
            url = None
        return url

    @property
    def address(self):
        """Get the address from the associated location for the user."""
        if self.location is None:
            return None
        else:
            return self.location.address

    @address.setter
    def address(self, val):
        """Update the user location's address."""
        if self.location is None:
            self.location = locations.Location.create(address=val, host=self,
                                                      name=self.public_name)
        else:
            self.location.update(address=val)
        th = FlaskThread(target=self.location.update_coordinates)
        th.start()

    def get_hosted_meals(self):
        """Get the meals that this user hosts."""
        return self.location.meals

    def get_joined_meals(self):
        """Get the meals that this user joined."""
        return [um.meal for um in
                meals.UserMeal.query.join(User).filter(
                    meals.UserMeal.user_id == self.id).all()]

    def get_reviews_as_subject(self):
        """Return the reviews that were written about the user."""
        return reviews.Review.query.join(meals.Meal).join(locations.Location)\
            .filter(locations.Location.id == self.location.id).all()

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<User({public_name!r})>'.format(public_name=self.public_name)
