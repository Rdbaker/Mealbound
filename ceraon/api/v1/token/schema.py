# -*- coding: utf-8 -*-
"""Token schema."""
from marshmallow import Schema, fields

class TokenSchema(Schema):
    token = fields.String(required=True)

    class Meta:
        type_ = 'token'
        strict = True

