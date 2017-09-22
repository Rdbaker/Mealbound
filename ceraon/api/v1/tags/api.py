# -*- encoding: utf-8 -*-
"""API routes for tags."""

from flask import jsonify, request

from ceraon.models.tags import Tag
from ceraon.utils import RESTBlueprint

from .schema import TagSchema

blueprint = RESTBlueprint('tags', __name__, version='v1')

TAG_SCHEMA = TagSchema(exclude=TagSchema.private_fields)


@blueprint.list()
def search_tags():
    """List tags or search for them.

    ---
    tags:
      - tags
    definitions:
      - schema:
          id: Tag
          properties:
            id:
             type: number
             description: the tag's ID
            title:
             type: string
             description: the display name of the tag
            alias:
             type: string
             description: the internal code for the tag
    parameters:
      - in: query
        name: q
        description: The query to use for searching for a tag by title
    responses:
      200:
        description: tag data found
        schema:
          id: Tag
    """
    query = request.args.get('q')
    if not query:
        tags = Tag.query.all()
    else:
        tags = Tag.search(query)
    return jsonify(data=TAG_SCHEMA.dump(tags, many=True).data)
