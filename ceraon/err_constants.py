# -*- coding: utf-8 -*-
"""Error codes for use in the application."""


class Errors(object):
    BAD_GUID = ('bad-guid', 'We couldn\'t understand the format of the ID.')
    LOCATION_NAME_MISSING = ('location-name-missing', 'We require a name.')
    LOCATION_NOT_FOUND = ('location-not-found',
                          'We couldn\'t find that location, sorry about that')
