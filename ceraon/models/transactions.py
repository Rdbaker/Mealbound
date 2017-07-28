# -*- coding: utf-8 -*-
"""Models for transactions."""
import datetime as dt
import uuid

import stripe
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
        try:
            stripe.Charge.create(
                amount=self.amount * 100,
                currency='usd',
                customer=self.payer.stripe_customer_id
            )
        except:
            return False
        else:
            self.update(transaction_went_through=True)
        return True

    def cancel(self):
        """Cancel the charge for the transaction and start the refund process.

        We use stripe, so if we change this later, we should change the low
        level implementation details, but the general flow should be the same.
        """
        self.update(canceled=True)
        # TODO: automate this flow later, if we're okay with that.
        # for now, we'll do payouts manually
        return True

    @staticmethod
    def set_stripe_id_on_user(user, token):
        """Set the stripe_customer_id on the given user with the given token.

        Since this class is responsible for interfacing with our payments
        vendor, it is responsible for setting up the user with a corresponding
        Stripe customer.

        :param user User: the user to set the stripe_customer_id on
        :param token string: the token stripe returned in exchange for payment
            info
        :return None:
        """
        if user.stripe_customer_id is None:
            customer = stripe.Customer.create(
                email=user.email,
                source=token
            )
            user.stripe_customer_id = customer.id
            user.save()
        else:
            customer = stripe.Customer.retrieve(user.stripe_customer_id)
            customer.source = token
            customer.save()
