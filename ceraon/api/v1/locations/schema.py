# -*- coding: utf-8 -*-
"""Location schema."""
from marshmallow import Schema, fields, validates
from werkzeug.exceptions import BadRequest

from ceraon.constants import Errors


class LocationSchema(Schema):
    """A schema for a Location model."""

    created_at = fields.DateTime(dump_only=True)
    name = fields.String(required=True, load_only=True)
    id = fields.UUID()
    address = fields.Str()
    latitude = fields.Float()
    longitude = fields.Float()

    private_fields = ['address', 'latitude', 'longitude']

    class Meta:
        """The mata class for the location schema."""

        type_ = 'location'
        strict = True

    @validates('name')
    def validate_name(self, value):
        """Validate the name of the location."""
        if not value:
            raise BadRequest(Errors.LOCATION_NAME_MISSING)
