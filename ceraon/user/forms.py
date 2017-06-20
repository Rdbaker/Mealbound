# -*- coding: utf-8 -*-
"""User forms."""
from flask_wtf import Form
from wtforms import PasswordField, StringField
from wtforms.validators import DataRequired, Email, EqualTo, Length

from ceraon.models.locations import Location

from .models import User


class RegisterForm(Form):
    """Register form."""

    email = StringField('Email',
                        validators=[DataRequired(), Email(),
                                    Length(min=6, max=40)])
    password = PasswordField('Password',
                             validators=[DataRequired(),
                                         Length(min=6, max=40)])
    confirm = PasswordField('Verify password',
                            [DataRequired(),
                             EqualTo('password',
                                     message='Passwords must match')])

    def __init__(self, *args, **kwargs):
        """Create instance."""
        super(RegisterForm, self).__init__(*args, **kwargs)
        self.user = None

    def validate(self):
        """Validate the form."""
        initial_validation = super(RegisterForm, self).validate()
        if not initial_validation:
            return False
        user = User.query.filter_by(email=self.email.data).first()
        if user:
            self.email.errors.append('Email already registered')
            return False
        return True


class EditProfileForm(Form):
    """Form for the user to edit their profile."""

    email = StringField('Email',
                        validators=[DataRequired(), Email(),
                                    Length(min=6, max=40)])
    password = PasswordField('Password',
                             validators=[Length(min=6, max=40)])
    confirm = PasswordField('Verify password',
                            [EqualTo('password',
                                     message='Passwords must match')])
    first_name = StringField('First Name',
                             validators=[Length(min=3, max=25)])
    last_name = StringField('Last Name',
                            validators=[Length(min=3, max=25)])
    address = StringField('Address', validators=[Length(min=3, max=255)])
    password = PasswordField('Password',
                             validators=[Length(min=6, max=40)])
    confirm = PasswordField('Verify password',
                            [EqualTo('password',
                                     message='Passwords must match')])

    def __init__(self, user, *args, **kwargs):
        """Initialize the edit profile form.

        :param user User: the user the form is meant to be editing.
        """
        super(EditProfileForm, self).__init__(*args, **kwargs)
        self.user = user

    def validate(self):
        """Validate the form."""
        # if no new password was supplied, add a placeholder for validation
        gave_new_password = False
        if not self.password.data:
            gave_new_password = True
            self.password.data = 'placeholder'
            self.confirm.data = 'placeholder'
        initial_validation = super(EditProfileForm, self).validate()
        if gave_new_password:
            self.password.data = None
            self.confirm.data = None

        if not initial_validation:
            return False
        if self.user.email != self.email.data:
            taken_user = User.query.filter_by(email=self.email.data)\
                .first()
            if taken_user:
                self.email.errors.append('Email already registered')
                return False

        if not self.user.location and self.address.data:
            # don't throw an error, create a new location for the user behind
            # the scenes
            Location.create(host=self.user, name=self.user.public_name)
        return True
