# -*- coding: utf-8 -*-
"""Error codes for use in the application."""


class Errors(object):
    """Contansts for errors in the form of: (code, message)."""

    BAD_GUID = ('bad-guid', 'We couldn\'t understand the format of the ID.')
    LOCATION_NAME_MISSING = ('location-name-missing', 'We require a name.')
    LOCATION_NOT_FOUND = ('location-not-found',
                          'We couldn\'t find that location, sorry about that')
    LOCATION_ALREADY_CREATED = ('location-already-created',
                                'You\'ve already created your location!')
    LOCATION_NOT_CREATED_YET = ('location-not-created-yet',
                                'You need to create a location first!')
    CANT_DELETE_MEAL = ('cant-delete-meal', 'You can\'t do that to somebody '
                        'else\'s meal')
    MEAL_NEEDS_COST = ('meal-needs-cost', 'The meal needs a cost (even $0)')
    NON_NEGATIVE = ('non-negative', 'This can\'t be negative')
    CANNOT_JOIN_MEAL = ('cannot-join-meal', 'You can\'t join that meal')
    MEAL_NAME_MISSING = ('meal-name-missing', 'That meal needs a name')
    MEAL_PRICE_MISSING = ('meal-price-missing', 'That meal needs a price')
    MEAL_PRICE_NEGATIVE = ('meal-price-negative', 'A price cannot be negative')
    MEAL_NOT_FOUND = ('meal-not-found',
                      'We couldn\'t find that meal, sorry about that')
    MEAL_CREATE_IN_PAST = ('meal-create-in-past',
                           'You can\'t create a meal in the past!')
    NOT_YOUR_MEAL = ('not-your-meal', 'You can\'t do that to somebody else\'s'
                                      ' meal!')


class Success(object):
    """Contansts for successes in the form of: (code, message)."""

    LOCATION_CREATED = ('location-created', 'You created your location!')
    LOCATION_UPDATED = ('location-updated', 'You updated your location!')
    MEAL_CREATED = ('meal-created', 'You scheduled a new meal!')
    MEAL_UPDATED = ('meal-updated', 'You updated your meal!')
    MEAL_WAS_JOINED = ('meal-joined', 'You successfully joined a meal!')
    MEAL_WAS_LEFT = ('meal-left', 'Reservation successfully canceled')
