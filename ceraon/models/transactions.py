# -*- coding: utf-8 -*-
"""Models for transactions."""
import datetime as dt
import uuid

from sqlalchemy.dialects.postgresql import JSONB, UUID

from ceraon.database import Column, IDModel, db, reference_col, relationship


class Transaction(IDModel):
    """A transaction made by a user for a meal.

    For now, we're using stripe to process payments in our API. This will mean
    that some of the columns we have here are internal to stripe.
    """

    __tablename__ = 'transaction'

    created_at = Column(db.DateTime(timezone=True), nullable=False,
                        default=dt.datetime.utcnow)
    meal_id = reference_col('meal', nullable=False)
    meal = relationship('Meal')
    payer_id = reference_col('users', nullable=False)
    payer = relationship('User', foreign_keys=[payer_id])
    payee_id = reference_col('users', nullable=False)
    payee = relationship('User', foreign_keys=[payee_id])
    transaction_went_through = Column(db.Boolean, nullable=False, default=False)
    transaction_paid_out = Column(db.Boolean, nullable=False, default=False)
    canceled = Column(db.Boolean, nullable=False, default=False)
    refunded = Column(db.Boolean, nullable=False, default=False)
    stripe_idempotency_key = Column(UUID(as_uuid=True), nullable=False,
                                    default=uuid.uuid4)

    # the cost of the transaction in USD
    amount = Column(db.Float(), nullable=False)

    # data from Stripe that was returned after the "charge" was created
    # NOTE: stripe shows the "amount" of a charge in cents
    stripe_payload = Column(JSONB)

    def charge(self):
        """Run the charge for the transaction.

        We use stripe, so if we change this later, we should change the low
        level implementation details, but the general flow should be the same.
        """
        pass

    def cancel(self):
        """Cancel the charge for the transaction and start the refund process.

        We use stripe, so if we change this later, we should change the low
        level implementation details, but the general flow should be the same.
        """
        self.update(canceled=True)
        # TODO: finish this flow
        return None
