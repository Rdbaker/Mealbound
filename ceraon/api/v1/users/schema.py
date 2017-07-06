# -*- coding: utf-8 -*-
"""User schema."""
from marshmallow import Schema, fields


class UserSchema(Schema):
    """A schema for a User model."""

    id = fields.Integer(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    public_name = fields.Str(dump_only=True)
    image_url = fields.URL(dump_only=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    email = fields.Str(required=True)
    address = fields.Str()

    private_fields = ['email', 'address']

    class Meta:
        """Meta class for User schema."""

        type_ = 'users'
        strict = True
