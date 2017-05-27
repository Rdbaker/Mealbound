# -*- coding: utf-8 -*-
"""Location forms."""
from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Length


class LocationForm(FlaskForm):
    """The form to save a location."""

    name = StringField('Name of the location',
                       validators=[DataRequired(), Length(min=3, max=128)])
    address = StringField('What is the address',
                          validators=[DataRequired(), Length(max=256)])
