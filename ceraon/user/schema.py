# -*- coding: utf-8 -*-
"""User schema."""
from marshmallow import Schema, fields


class UserSchema(Schema):
    """Schema for a user."""

    first_name = fields.String(required=True)
    last_name = fields.String(required=True)
    public_name = fields.String()
    facebook_id = fields.Str(dump_only=True)
    id = fields.Str(dump_only=True)

    class Meta:
        """Meta class config."""

        type_ = 'user'
        strict = True
