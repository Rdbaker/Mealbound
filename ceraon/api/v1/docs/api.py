"""Routes for swagger docs."""
from flask import Blueprint, abort, current_app, jsonify, render_template

from flask_swagger import swagger

blueprint = Blueprint('apidocs', __name__, url_prefix='/api/v1')


@blueprint.route('/spec')
def spec():
    """Get the swagger API spec."""
    if not current_app.config['DEBUG']:
        abort(404)
    swag = swagger(current_app)
    swag['info']['version'] = "1.0"
    swag['info']['title'] = "Ceraon API"
    return jsonify(swag)


@blueprint.route("/docs")
def docs():
    """Get the swagger UI page."""
    return render_template('swagger-index.html')
