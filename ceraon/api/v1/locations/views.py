"""API routes for locations."""

from flask import jsonify, request
from werkzeug.exceptions import NotFound

from ceraon.constants import Errors
from ceraon.models.locations import Location
from ceraon.utils import RESTBlueprint

from .schema import LocationSchema

blueprint = RESTBlueprint('locations', __name__, version='v1')

LOCATION_SCHEMA = LocationSchema()


@blueprint.find()
def find_location(uid):
    location = Location.find(uid)
    if location is None:
        raise NotFound(Errors.LOCATION_NOT_FOUND)
    return jsonify(data=LOCATION_SCHEMA.dump(location).data)


@blueprint.list()
def list_locations():
    """List the locations

    :param page int: (default: 1) the page of locations to retrieve
    :param per_page int: (default: 10) the size of the page to return
    :param source string: return locations from a specific source, "internal"
        for locations with no external source
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
