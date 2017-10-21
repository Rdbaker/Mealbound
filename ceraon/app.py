# -*- coding: utf-8 -*-
"""The app module, containing the app factory function."""
import json
import os

import stripe
from flask import Flask, g, jsonify, render_template
from flask_admin import Admin
from flask_login import current_user
from flask_sslify import SSLify
from marshmallow.exceptions import ValidationError

from ceraon import commands, public, user
from ceraon.admin import AdminModelView
from ceraon.assets import assets
from ceraon.eager_loader import assign_requested_entity
from ceraon.errors import APIException
from ceraon.extensions import (bcrypt, cache, csrf_protect, db, debug_toolbar,
                               login_manager, migrate, sentry)
from ceraon.models import locations as locations_models  # noqa
from ceraon.models import meals as meals_models  # noqa
from ceraon.models import reviews as reviews_models  # noqa
from ceraon.models import tags as tags_models  # noqa
from ceraon.models import transactions as transactions_models  # noqa
from ceraon.settings import ProdConfig


def create_app(config_object=ProdConfig):
    """This function is an application factory.

    As explained here: http://flask.pocoo.org/docs/patterns/appfactories/.

    :param config_object: The configuration object to use.
    """
    app = Flask(__name__.split('.')[0])
    app.config.from_object(config_object)
    register_blueprints(app)
    register_extensions(app)
    register_errorhandlers(app)
    register_shellcontext(app)
    register_commands(app)
    register_admin(app)

    @app.context_processor
    def inject_fb_app_ID():
        return dict(
            fb_app_id=app.config['FB_APP_ID'],
            stripe_pub_key=app.config['STRIPE_PUBLISHABLE_KEY'],
            embed_entity=json.dumps(g.embed_entity),
            current_user_json=json.dumps(g.current_user_json),
            mixpanel_enabled=app.config['MIXPANEL_ENABLED'],
            mixpanel_id=app.config['MIXPANEL_ID'],
        )

    @app.before_request
    def embed_entity():
        """Embed the entity based on the request."""
        # NOTE: this relies pretty heavily on the fact that the before_request
        # runs before the context_processor. If that's ever False, we'll have
        # to change how this works.
        assign_requested_entity()

    @app.before_request
    def set_sentry_user_context():
        """Add the user to the sentry context."""
        sentry.user_context({'id': getattr(current_user, 'id', None)})

    @app.route("/swagger/spec")
    def spec():
        from flask_swagger import swagger
        swag = swagger(app)
        swag['info']['version'] = "1.0"
        swag['info']['title'] = "Ceraon API"
        return jsonify(swag)

    @app.route("/swagger/docs")
    def api_doct():
        return render_template('swagger-index.html')

    return app


def register_extensions(app):
    """Register Flask extensions."""
    # only use SSL if we're on heroku
    if 'DYNO' in os.environ:
        SSLify(app)

    stripe.api_key = app.config['STRIPE_SECRET_KEY']
    assets.init_app(app)
    bcrypt.init_app(app)
    cache.init_app(app)
    db.init_app(app)
    csrf_protect.init_app(app)
    login_manager.init_app(app)
    debug_toolbar.init_app(app)
    migrate.init_app(app, db)
    sentry.init_app(app, app.config['SENTRY_DSN'])
    return None


def register_blueprints(app):
    """Register Flask blueprints."""
    app.register_blueprint(public.views.blueprint)

    from ceraon.api.v1.locations import views as locations_views
    from ceraon.api.v1.token import views as token_views
    from ceraon.api.v1.sessions import views as sessions_views
    from ceraon.api.v1.meals import api as meals_views
    from ceraon.api.v1.users import api as users_views
    from ceraon.api.v1.reviews import api as reviews_views
    from ceraon.api.v1.docs import api as docs_views
    from ceraon.api.v1.tags import api as tags_views

    app.register_blueprint(locations_views.blueprint)
    app.register_blueprint(token_views.blueprint)
    app.register_blueprint(sessions_views.blueprint)
    app.register_blueprint(meals_views.blueprint)
    app.register_blueprint(users_views.blueprint)
    app.register_blueprint(reviews_views.blueprint)
    app.register_blueprint(docs_views.blueprint)
    app.register_blueprint(tags_views.blueprint)

    return None


def register_errorhandlers(app):
    """Register error handlers."""
    @app.errorhandler(ValidationError)
    def handle_marshmallow_validation_error(ex):
        response = jsonify(error_code="data-validation-error",
                           error_message=ex.messages)
        response.status_code = 422
        return response

    @app.errorhandler(APIException)
    def handle_api_error(err):
        """Handle an APIException."""
        return jsonify(err.to_dict()), err.status_code

    def render_error(error):
        """Render error template."""
        # If a HTTPException, pull the `code` attribute; default to 500
        error_code = getattr(error, 'code', 500)
        return render_template('{0}.html'.format(error_code)), error_code
    for errcode in [401, 404, 500]:
        app.errorhandler(errcode)(render_error)

    return None


def register_shellcontext(app):
    """Register shell context objects."""
    def shell_context():
        """Shell context objects."""
        return {
            'db': db,
            'User': user.models.User}

    app.shell_context_processor(shell_context)


def register_admin(app):
    """Register the admin panel."""
    admin = Admin(app, name='Mealbound Admin Panel',
                  template_mode='bootstrap3')

    admin.index_view.is_accessible = AdminModelView._is_accessible
    admin.index_view.inaccessible_callback = \
        AdminModelView._inaccessible_callback

    for model in [
        locations_models.Location,
        meals_models.Meal,
        meals_models.UserMeal,
        reviews_models.Review,
        transactions_models.Transaction,
        tags_models.Tag,
        tags_models.MealTag
    ]:
        admin.add_view(AdminModelView(
            model,
            db.session,
            endpoint='admin-{}'.format(model.__name__.lower())))
    admin.add_view(AdminModelView(user.models.User, db.session,
                                  endpoint='admin-user'))

    return None


def register_commands(app):
    """Register Click commands."""
    app.cli.add_command(commands.test)
    app.cli.add_command(commands.lint)
    app.cli.add_command(commands.clean)
    app.cli.add_command(commands.urls)
