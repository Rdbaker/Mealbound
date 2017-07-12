# -*- coding: utf-8 -*-
"""Review schema."""
from marshmallow import Schema, ValidationError, fields, validates

from ceraon.api.v1.meals.schema import MealSchema
from ceraon.api.v1.users.schema import UserSchema
from ceraon.constants import Errors


class ReviewSchema(Schema):
    """A schema for a Review model."""

    id = fields.UUID(dump_only=True)
    description = fields.String(required=True)
    created_at = fields.DateTime(dump_only=True)
    rating = fields.Float(required=True, places=2)
    user = fields.Nested(UserSchema, dump_only=True, dump_to='reviewer')
    meal = fields.Nested(MealSchema, dump_only=True,
                         exclude=['location', 'host'])

    private_fields = ['meal.{}'.format(field)
                      for field in MealSchema.private_fields] + \
                     ['user.{}'.format(field)
                      for field in UserSchema.private_fields]

    class Meta:
        """Meta class for Review schema."""

        type_ = 'review'
        strict = True

    @validates('description')
    def validate_description(self, value):
        """Ensures that the description passes validation."""
        if not value:
            raise ValidationError(Errors.REVIEW_DESCRIPTION_MISSING[1])
        if len(value) > 1000:  # arbitrary
            raise ValidationError(Errors.REVIEW_DESCRIPTION_TOO_BIG[1])

    @validates('rating')
    def validate_rating(self, value):
        """Ensure that the rating passes validation.

        Make sure that the validation here is the same as the validation in the
        review model class.
        """
        if not value:
            raise ValidationError(Errors.REVIEW_RATING_MISSING[1])
        if value % 0.5 != 0 or value < 0 or value > 5:
            raise ValidationError(Errors.REVIEW_RATING_BAD[1])
