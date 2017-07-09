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
    MEAL_ALREADY_JOINED = ('meal-already-joined',
                           'You already joined that meal')
    MEAL_ALREADY_HAPPENED = ('meal-already-happened',
                             'You can\'t do that for a meal that '
                             'happened already!')
    MEAL_NOT_JOINED = ('meal-not-joined',
                       'You need to join that meal first')
    JOIN_HOSTED_MEAL = ('join-hosted-meal',
                        'You cannot join your own meal')
    MEAL_NAME_MISSING = ('meal-name-missing', 'That meal needs a name')
    MEAL_PRICE_MISSING = ('meal-price-missing', 'That meal needs a price')
    MEAL_PRICE_NEGATIVE = ('meal-price-negative', 'A price cannot be negative')
    MEAL_NOT_FOUND = ('meal-not-found',
                      'We couldn\'t find that meal, sorry about that')
    MEAL_CREATE_IN_PAST = ('meal-create-in-past',
                           'You can\'t create a meal in the past!')
    NOT_YOUR_MEAL = ('not-your-meal', 'You can\'t do that to somebody else\'s'
                                      ' meal!')
    USER_NOT_FOUND = ('user-not-found', 'That user doesn\'t exist')
    PASSWORD_CONFIRM_MATCH = ('password-confirm-match',
                              'Password and confirm fields must match')
    INVALID_MEAL_ROLE = ('invalid-meal-role',
                         'A meal role must either be "guest" or "host"')
    REVIEW_DESCRIPTION_MISSING = ('review-description-missing',
                                  'A review must have a body')
    REVIEW_DESCRIPTION_TOO_BIG = ('review-description-too-big',
                                  'The review body is too big')
    REVIEW_RATING_MISSING = ('review-rating-missing', 'A review needs a rating')
    REVIEW_RATING_BAD = ('review-rating-bad', 'A review rating is a whole or'
                         ' half number between 0 and 5')
    REVIEW_NOT_FOUND = ('review-not-found', 'That review could not be found')
    NOT_YOUR_REVIEW = ('not-your-review', 'You can\'t edit that review!')
    BAD_REVIEW_ID = ('bad-review-id', 'A review ID is in the form'
                                      ' (meal_id, user_id)')
    REVIEW_IN_FUTURE = ('review-in-future', 'You can\'t review a meal that '
                                            'hasn\'t happened yet!')
    REVIEW_NONJOINED_MEAL = ('review-nonjoined-meal', 'You can\'t review a meal'
                                                      ' that you didn\'t join')


class Success(object):
    """Contansts for successes in the form of: (code, message)."""

    LOCATION_CREATED = ('location-created', 'You created your location!')
    LOCATION_UPDATED = ('location-updated', 'You updated your location!')
    MEAL_CREATED = ('meal-created', 'You scheduled a new meal!')
    MEAL_UPDATED = ('meal-updated', 'You updated your meal!')
    MEAL_WAS_JOINED = ('meal-joined', 'You successfully joined a meal!')
    MEAL_WAS_LEFT = ('meal-left', 'Reservation successfully canceled')
    MEAL_DELETED = ('meal-deleted', 'Meal successfully canceled')
    PROFILE_UPDATED = ('profile-updated', 'Profile successfully updated!')
    REVIEW_CREATED = ('review-created', 'Your review has been submitted '
                                        'successfully')
    REVIEW_UPDATED = ('review-updated', 'Your review has been updated')
    REVIEW_DELETED = ('review-deleted', 'Review successfully removed')
