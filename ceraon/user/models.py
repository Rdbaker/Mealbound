# -*- coding: utf-8 -*-
"""User models."""
import datetime as dt

from flask import current_app
from flask_login import UserMixin
from sqlalchemy.orm import backref

from ceraon.database import (Column, Model, SurrogatePK, db, reference_col,
                             relationship)
from ceraon.extensions import bcrypt
from ceraon.models import locations

from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)

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
    username = Column(db.String(80), unique=True, nullable=False)
    email = Column(db.String(80), unique=True, nullable=False)
    #: The hashed password
    password = Column(db.Binary(128), nullable=True)
    created_at = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    first_name = Column(db.String(30), nullable=True)
    last_name = Column(db.String(30), nullable=True)
    active = Column(db.Boolean(), default=False)
    is_admin = Column(db.Boolean(), default=False)

    location_id = reference_col('location', nullable=True)
    location = relationship('Location', backref=backref('host', uselist=False),
                            cascade='delete')

    user_meals = relationship('UserMeal', cascade='delete')

    def __init__(self, username, email, password=None, **kwargs):
        """Create instance."""
        db.Model.__init__(self, username=username, email=email, **kwargs)
        if password:
            self.set_password(password)
        else:
            self.password = None

    @classmethod
    def create(cls, **kwargs):
        """Create the new user."""
        newUser = super(Model, cls).create(**kwargs)
        # Auto create location for user
        locations.Location.create(host=newUser, name=newUser.username)
        return newUser

    def set_password(self, password):
        """Set password."""
        self.password = bcrypt.generate_password_hash(password)

    def check_password(self, value):
        """Check password."""
        return bcrypt.check_password_hash(self.password, value)


    # Adapted from https://blog.miguelgrinberg.com/post/restful-authentication-with-flask
    def get_auth_token(self, expiration = 600):
        """Retrieve a signed auth token for the user"""
        serializer = Serializer(current_app.config['SECRET_KEY'], expires_in=expiration)
        return serializer.dumps({'userId': self.id})

    @staticmethod
    def verify_auth_token(token):
        """Check an auth token to see if it is valid, and if so returns the token's user"""
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
    def public_name(self):
        """Try returning <first name> <last initial>, or default to username.

        example usage:
            >>> u = user(first_name='Ryan', last_name='Baker',
                         username='rbaker')
            >>> u.public_name
            u'Ryan B.'
            >>> u.last_name = None
            >>> u.public_name
            u'Ryan'
            >>> u.first_name = None
            >>> u.public_name
            u'rbaker'
        """
        if self.first_name is None:
            return self.username
        else:
            if self.last_name is not None and len(self.last_name) > 0:
                return '{} {}.'.format(self.first_name, self.last_name[0])
            else:
                return self.first_name

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<User({username!r})>'.format(username=self.username)
