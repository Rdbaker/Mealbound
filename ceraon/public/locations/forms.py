# -*- coding: utf-8 -*-
"""Location forms."""
from flask_login import current_user
from flask_wtf import Form
from wtforms import PasswordField, StringField
from wtforms.validators import DataRequired, Email, EqualTo, Length

from ceraon.err_constants import Errors
from ceraon.models.locations import Location


class LocationForm(Form):
    """The form to save a location."""

    name = StringField('Name of the location',
                       validators=[DataRequired(), Length(min=3, max=128)])
    address = StringField('What is the address',
                          validators=[DataRequired(), Length(max=256)])
