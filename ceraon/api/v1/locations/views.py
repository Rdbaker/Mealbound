"""API routes for locations."""

from flask import Blueprint, jsonify, request

from ceraon.models.locations import Location

from .schema import LocationSchema

blueprint = Blueprint('locations', __name__, url_prefix='/api/v1/locations')

LOCATION_SCHEMA = LocationSchema()

@blueprint.route('', methods=['GET'])
def list_locations():
    """List the locations

    :param page int: (default: 1) the page of locations to retrieve
    :param per_page int: (default: 10) the size of the page to return
    """
    page = Location.query.paginate(
        page=int(request.args.get('page', 1)),
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
