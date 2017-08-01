# -*- coding: utf-8 -*-
"""Models for reviews."""
import datetime as dt

from sqlalchemy.orm import validates

from ceraon.database import Column, UUIDModel, db, reference_col, relationship


class Review(UUIDModel):
    """A review left by a user for a meal."""

    __tablename__ = 'review'

    created_at = Column(db.DateTime(timezone=True), nullable=False,
                        default=dt.datetime.utcnow)
    rating = Column(db.Float(), nullable=False)
    description = Column(db.Text, nullable=False)
    meal_id = reference_col('meal', nullable=False)
    meal = relationship('Meal')
    user_id = reference_col('users', nullable=False)
    user = relationship('User')

    @validates('rating')
    def validate_rating(self, key, rating):
        """Validate the rating value.

        The rating value must be a whole or half number between (inclusive) 0
        and 5.
        """
        assert rating % 0.5 == 0
        assert rating >= 0 and rating <= 5
        return rating
