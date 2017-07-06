# -*- encoding: utf-8 -*-
"""Module for the eager loader of an entity."""

import flask

from ceraon.api.v1.locations.schema import LocationSchema
from ceraon.api.v1.meals.schema import MealSchema
from ceraon.api.v1.users.schema import UserSchema
from ceraon.models import locations, meals
from ceraon.user.models import User


ENTITY_MAP = {
    'location': {
        'model': locations.Location,
        'schema': LocationSchema,
    },
    'meal': {
        'model': meals.Meal,
        'schema': MealSchema,
    },
    'user': {
        'model': User,
        'schema': UserSchema,
    },
}


def assign_requested_entity():
    """Resolve the entity that was requested from the query params."""
    entity_class = flask.request.args.get('embed_class')
    entity = ENTITY_MAP.get(entity_class)
    if entity is not None:
        entity_id = flask.request.args.get('embed_id')
        try:
            instance = entity['model'].find(entity_id)
        except:
            instance = None
        # model with ID might not exist
        if instance is None:
            flask.g.embed_entity = None
        else:
            entity_fields = flask.request.args.getlist('embed_fields')
            schema = entity['schema']
            if hasattr(schema, 'private_fields'):
                exclude_fields = schema.private_fields
            else:
                exclude_fields = []
            try:
                flask.g.embed_entity = schema(
                    only=entity_fields, exclude=exclude_fields)\
                    .dump(instance).data
            except AttributeError:
                # bad fields might have been specified
                flask.g.embed_entity = None
    else:
        flask.g.embed_entity = None
