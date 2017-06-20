# -*- coding: utf-8 -*-
"""Session schema."""
from marshmallow import Schema, fields


class FacebookSessionSchema(Schema):
    """Schema for a facebook session."""

    email = fields.Email()
    first_name = fields.String(required=True)
    last_name = fields.String(required=True)
    facebook_id = fields.Str(required=True, load_from='id')

    class Meta:
        """Meta class config."""

        type_ = 'facebook_session'
        strict = True
