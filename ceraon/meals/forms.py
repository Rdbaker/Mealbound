# -*- coding: utf-8 -*-
"""Meal forms."""
from datetime import datetime as dt

from flask_wtf import FlaskForm
from wtforms import DateTimeField, DecimalField, StringField
from wtforms.validators import DataRequired, Length, ValidationError

from ceraon.constants import Errors


class MealForm(FlaskForm):
    """The form to save a meal."""

    name = StringField('Meal name', validators=[DataRequired(),
                                                Length(min=3, max=128)])
    description = StringField('Meal description',
                              validators=[DataRequired(), Length(max=255)])
    scheduled_for = DateTimeField('Time', format='%m/%d/%Y %I:%M %p',
                                  validators=[DataRequired()])
    cost = DecimalField('Price')

    def validate_scheduled_for(self, field):
        """Make sure the meal is scheduled for a valid time."""
        if field.data < dt.now():
            raise ValidationError(Errors.MEAL_CREATE_AFTER_NOW[1])

    def validate_cost(self, field):
        """Make sure the cost is valid."""
        if field.data is None:
            raise ValidationError(Errors.MEAL_NEEDS_COST[1])
        if field.data < 0:
            raise ValidationError(Errors.NON_NEGATIVE[1])
