# -*- coding: utf-8 -*-
"""Tag schema."""
from marshmallow import Schema, fields


class TagSchema(Schema):
    """A schema for a Tag model."""

    id = fields.Int(dump_only=True)
    title = fields.String(dump_only=True)
    alias = fields.String(dump_only=True)

    private_fields = []

    class Meta:
        """Meta class for Tag schema."""

        type_ = 'tag'
        strict = True
