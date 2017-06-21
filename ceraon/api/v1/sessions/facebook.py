# -*- coding: utf-8 -*-
"""Facebook utils for the sessions API."""

import facebook
from flask import request, current_app

from ceraon.user.models import User

from .schema import FacebookSessionSchema


def get_fb_user_from_cookie():
    """Get the facebook user from the request cookies.

    Make sure to ask facebook for the following: first_name, last_name, email,
    and id.

    :return dict: the response dictionary from facebook
    """
    # get the access token from the cookies
    access_token = facebook.get_user_from_cookie(
        request.cookies, current_app.config['FB_APP_ID'],
        current_app.config['FB_APP_SECRET'])

    # if the user is not logged in
    if not access_token:
        return None

    # create the API connection
    graph = facebook.GraphAPI(access_token=access_token['access_token'],
                              version='2.9')

    # get the user from facebook
    return FacebookSessionSchema().load(graph.get_object(
        id='me', fields='id,first_name,last_name,email')).data


def resolve_user_from_fb_response(user_from_fb):
    """Get a user from our database based on FB's given user data.

    :param user_from_fb dict: the raw user data from FB. We asked for
        first_name, last_name, id, and email
    :return User: the user that we resolved from FB's user
    """
    # see if we can get the user in the case that they're logged in already via
    # facebook
    user_from_db = User.query.filter_by(
        facebook_id=user_from_fb['facebook_id']).first()

    # otherwise, see if they gave us their email and they don't currently have
    # a facebook account linked here
    if not user_from_db and user_from_fb.get('email'):

        # if so, try to get them from their email
        user_from_db = User.query.filter_by(email=user_from_fb.get('email'))\
            .first()

        # check if it's their first time logging in ever
        if not user_from_db:
            # make a new user!
            user_from_db = User.create(**user_from_fb)

        else:
            # we now have a user's facebook ID. Let's make sure we save that
            # for future use.
            user_from_db.update(facebook_id=user_from_fb.get('facebook_id'))

    elif not user_from_db:
        # else we couldn't identify a FB account for this user and they didn't
        # supply an email from facebook -- we don't have a confident way to
        # resolve an existing identity from this information so we **MUST**
        # create a new user.
        # TODO: for new, we'll require that they give email access -- we should
        # TODO: fix this later if they don't want to give that to us
        # TODO: (uncomment) user_from_db = User.create(**user_from_fb)
        return None

    return user_from_db
