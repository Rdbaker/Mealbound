# -*- coding: utf-8 -*-
"""Meal schema."""
from datetime import datetime as dt

from marshmallow import Schema, ValidationError, fields, validates

from ceraon.api.v1.users.schema import UserSchema
from ceraon.constants import Errors


class MealSchema(Schema):
    """A schema for a Meal model."""

    id = fields.UUID(dump_only=True)
    name = fields.String(required=True)
    description = fields.String()
    scheduled_for = fields.DateTime(required=True)
    price = fields.Float(required=True, places=2)
    host = fields.Nested(UserSchema, dump_only=True)

    class Meta:
        """Meta class for Meal schema."""

        type_ = 'meal'
        strict = True

    @validates('name')
    def validate_name(self, value):
        """Validate the name field."""
        if not value:
            raise ValidationError(Errors.MEAL_NAME_MISSING[1])

    @validates('price')
    def validate_price(self, value):
        """Validate the price field."""
        if not value:
            raise ValidationError(Errors.MEAL_PRICE_MISSING[1])
        if value < 0:
            raise ValidationError(Errors.MEAL_PRICE_NEGATIVE[1])

    @validates('scheduled_for')
    def validate_scheduled_for(self, value):
        """Validate the scheduled_for field."""
        # if there is no timezone
        if value.tzinfo is None:
            # assign the server's timezone
            value = value.astimezone()
        if value <= dt.now().astimezone():
            raise ValidationError(Errors.MEAL_CREATE_IN_PAST[1])
