# -*- coding: utf-8 -*-
"""Meal schema."""
from marshmallow import Schema, fields, validates

from ceraon.api.v1.users.schema import UserSchema
from ceraon.constants import Errors
from ceraon.errors import UnprocessableEntity


class MealSchema(Schema):
    id = fields.UUID(dump_only=True)
    name = fields.String(required=True)
    description = fields.String()
    scheduled_for = fields.DateTime(required=True)
    price = fields.Float(required=True, places=2)
    host = fields.Nested(UserSchema, dump_only=True)

    class Meta:
        type_ = 'meal'
        strict = True

    @validates('name')
    def validate_name(self, value):
        if not value:
            raise UnprocessableEntity(Errors.MEAL_NAME_MISSING)

    @validates('price')
    def validate_price(self, value):
        if not value:
            raise UnprocessableEntity(Errors.MEAL_PRICE_MISSING)
        if value < 0:
            raise UnprocessableEntity(Errors.MEAL_PRICE_NEGATIVE)

    @validates('scheduled_for')
    def validate_scheduled_for(self, value):
        pass
