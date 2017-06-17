# -*- coding: utf-8 -*-
"""Application assets."""
from flask_assets import Bundle, Environment

css = Bundle(
    'libs/font-awesome/css/font-awesome.min.css',
    'libs/bootstrap/dist/css/bootstrap.css',
    'css/style.css',
    filters='cssmin',
    output='public/css/common.css'
)

js = Bundle(
    'libs/jQuery/dist/jquery.js',
    'libs/bootstrap/dist/js/bootstrap.js',
    'js/plugins.js',
    filters='jsmin',
    output='public/js/common.js'
)

assets = Environment()

assets.register('js_all', js)
assets.register('css_all', css)

css_refactor = Bundle(
    'libs/CeraonUI/dist/css/Ceraon.css'
)

js_refactor = Bundle(
    'libs/CeraonUI/dist/js/bundle.js'
)

assets.register('refactor_js_all', js_refactor)
assets.register('refactor_css_all', css_refactor)
