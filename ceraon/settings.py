# -*- coding: utf-8 -*-
"""Application configuration."""
import os


class Config(object):
    """Base configuration."""

    TESTING = False
    SECRET_KEY = os.environ.get('CERAON_SECRET', 'secret-key')
    APP_DIR = os.path.abspath(os.path.dirname(__file__))  # This directory
    PROJECT_ROOT = os.path.abspath(os.path.join(APP_DIR, os.pardir))
    BCRYPT_LOG_ROUNDS = 13
    ASSETS_DEBUG = False
    DEBUG_TB_ENABLED = False  # Disable Debug toolbar
    DEBUG_TB_INTERCEPT_REDIRECTS = False
    CACHE_TYPE = 'simple'  # Can be "memcached", "redis", etc.
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # APP ID for the local test version of the facebook app
    FB_APP_ID = '1485399264815691'
    FB_APP_SECRET = '9411025459b08d6904d9c8c7b372310e'
    # Stripe keys for test payment processing
    STRIPE_PUBLISHABLE_KEY = 'pk_test_oSUMO9DZ1t2wmvrkOSrdPfyw'
    STRIPE_SECRET_KEY = 'sk_test_r3d3YhfbE6dn5FgDcEZBHeHr'
    SENTRY_DSN = None
    MIXPANEL_ENABLED = False
    MIXPANEL_ID = None


class ProdConfig(Config):
    """Production configuration."""

    ENV = 'prod'
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    DEBUG_TB_ENABLED = False  # Disable Debug toolbar

    # APP ID for the real version of the facebook app
    FB_APP_ID = os.environ.get('FB_APP_ID')
    FB_APP_SECRET = os.environ.get('FB_APP_SECRET')

    SENTRY_USERNAME = os.environ.get('SENTRY_USERNAME')
    SENTRY_PW = os.environ.get('SENTRY_PW')
    SENTRY_APP_ID = os.environ.get('SENTRY_APP_ID')
    SENTRY_DSN = 'https://{}:{}@sentry.io/{}'.format(
        SENTRY_USERNAME, SENTRY_PW, SENTRY_APP_ID)
    STRIPE_PUBLISHABLE_KEY = os.environ.get('STRIPE_PUBLISHABLE_KEY')
    STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')
    MIXPANEL_ENABLED = True
    MIXPANEL_ID = os.environ.get('MIXPANEL_ID')


class DevConfig(Config):
    """Development configuration."""

    ENV = 'dev'
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'postgres://ceraon:ceraon123@' + \
        'localhost:5432/ceraon'
    DEBUG_TB_ENABLED = True
    ASSETS_DEBUG = True  # Don't bundle/minify static assets
    CACHE_TYPE = 'simple'  # Can be "memcached", "redis", etc.


class TestConfig(Config):
    """Test configuration."""

    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'postgres://ceraon:ceraon123@' + \
        'localhost:5432/ceraon_test'
    # For faster tests; needs at least 4 to avoid "ValueError: Invalid rounds"
    BCRYPT_LOG_ROUNDS = 4
    WTF_CSRF_ENABLED = False  # Allows form testing
