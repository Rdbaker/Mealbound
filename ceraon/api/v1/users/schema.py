# -*- coding: utf-8 -*-
"""User schema."""
from marshmallow import Schema, fields


class UserSchema(Schema):
    created_at = fields.DateTime(dump_only=True)
    public_name = fields.Str(dump_only=True)
    image_url = fields.URL(dump_only=True)

    class Meta:
        type_ = 'users'
        strict = True
