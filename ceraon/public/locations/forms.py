# -*- coding: utf-8 -*-
"""Location forms."""
from flask_login import current_user
from flask_wtf import Form
from wtforms import PasswordField, StringField
from wtforms.validators import DataRequired, Email, EqualTo, Length

from ceraon.err_constants import Errors
from ceraon.models.locations import Location


class CreateLocationForm(Form):
    """The form to create a location."""

    name = StringField('Name of the location',
                       validators=[DataRequired(), Length(min=3, max=128)])
    address = StringField('What is the address',
                          validators=[DataRequired(), Length(max=256)])

    def __init__(self, *args, **kwargs):
        """Create instance."""
        super(CreateLocationForm, self).__init__(*args, **kwargs)

    def validate(self):
        """Validate the form."""
        initial_validation = super(CreateLocationForm, self).validate()
        if not initial_validation:
            return False
        if current_user.location is not None:
            self.name.errors.append(Errors.LOCATION_ALREADY_CREATED)
            return False
        return True
