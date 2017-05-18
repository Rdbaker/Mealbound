# -*- coding: utf-8 -*-
"""Location schema."""
from marshmallow import Schema, fields, validates
from werkzeug.exceptions import BadRequest

from ceraon.err_constants import Errors
from ceraon.models.locations import Location


class LocationSchema(Schema):
    created_at = fields.DateTime(dump_only=True)
    name = fields.String(required=True)
    id = fields.UUID()

    class Meta:
        type_ = 'location'
        strict = True

    @validates('name')
    def validate_name(self, value):
        if not value:
            raise BadRequest(Errors.LOCATION_NAME_MISSING)
