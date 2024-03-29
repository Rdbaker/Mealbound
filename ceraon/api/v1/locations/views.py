"""API routes for locations."""

from flask import jsonify, request
from werkzeug.exceptions import NotFound

from ceraon.constants import Errors
from ceraon.models.locations import Location
from ceraon.utils import RESTBlueprint

from .schema import LocationSchema

blueprint = RESTBlueprint('locations', __name__, version='v1')

LOCATION_SCHEMA = LocationSchema(exclude=LocationSchema.private_fields)


@blueprint.find()
def find_location(uid):
    """Find a location given the uuid.

    ---
    tags:
     - locations
    definitions:
     - schema:
       id: Location
       properties:
         id:
           type: string
           description: the ID of the location
         address:
           type: string
           description: the full address of the location
         latitude:
           type: number
           format: Float
           description: the latitude of the location
         longitude:
           type: number
           format: Float
           description: the longitude of the location
    parameters:
     - in: path
       name: uid
       required: true
       description: the UUID of the location
    responses:
      200:
        description: Location data found
        schema:
          id: Locations
      404:
        description: The location could not be found
    """
    location = Location.find(uid)
    if location is None:
        raise NotFound(Errors.LOCATION_NOT_FOUND)
    return jsonify(data=LOCATION_SCHEMA.dump(location).data)


@blueprint.list()
def list_locations():
    """List the locations.

    ---
    tags:
     - locations
    parameters:
     - in: query
       name: page
       description: the page of the meals to retrieve
       default: 1
     - in: query
       name: per_page
       description: the number of results to return per page
       default: 10
     - in: query
       name: source
       description: the source of the location. Use "internal" for locations
            created by users
    responses:
      200:
        description: Location data found
        schema:
          type: array
          items:
            schema:
              id: Locations
    """
    if request.args.get('source') is not None:
        source = request.args.get('source')
        if source == 'internal':
            source = None
        filtered = Location.query.filter(Location.source == source)
    else:
        filtered = Location.query
    page = filtered.paginate(page=int(request.args.get('page', 1)),
                             per_page=int(request.args.get('per_page', 10)))

    meta_pagination = {
        'first': request.path + '?page={page}&per_page={per_page}'.format(
            page=1, per_page=page.per_page),
        'next': request.path + '?page={page}&per_page={per_page}'.format(
            page=page.next_num, per_page=page.per_page),
        'last': request.path + '?page={page}&per_page={per_page}'.format(
            page=page.pages or 1, per_page=page.per_page),
        'prev': request.path + '?page={page}&per_page={per_page}'.format(
            page=page.prev_num, per_page=page.per_page),
        'total': page.pages
    }

    if not page.has_next:
        meta_pagination.pop('next')
    if not page.has_prev:
        meta_pagination.pop('prev')

    return jsonify(data=LOCATION_SCHEMA.dump(page.items, many=True).data,
                   meta={'pagination': meta_pagination})
