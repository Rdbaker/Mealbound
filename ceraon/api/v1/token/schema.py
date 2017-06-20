# -*- coding: utf-8 -*-
"""Token schema."""
from marshmallow import Schema, fields


class TokenSchema(Schema):
    """The schema for a token."""

    token = fields.String(required=True)

    class Meta:
        """Meta class for the marshaller."""

        type_ = 'token'
        strict = True
