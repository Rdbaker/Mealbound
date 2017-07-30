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

    def charge(self, transaction_token=None):
        """Run the charge for the transaction.

        :param transaction_token string: (default: None) he string used to
            create a new transaction via stripe
        :return bool: indicating whether it was a success or failure

        We use stripe, so if we change this later, we should change the low
        level implementation details, but the general flow should be the same.
        """
        try:
            charge_params = {
                'amount': int(self.amount * 100),
                'currency': 'usd',
                'idempotency_key': str(self.stripe_idempotency_key)
            }
            # see if we're doing a one-time transaction or if we're charging a
            # card that stripe has on file
            if transaction_token is not None:
                charge_params.update(source=transaction_token)
            else:
                charge_params.update(customer=self.payer.stripe_customer_id)
            stripe.Charge.create(**charge_params)
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

    def payer_has_stripe_source(self):
        """Return true if the payer has a `source` on their stripe customer."""
        if not self.payer.stripe_customer_id:
            return False
        else:
            customer = stripe.Customer.retrieve(self.payer.stripe_customer_id)
            if customer is None or customer.source is None:
                return False
            else:
                return True

    @staticmethod
    def set_stripe_source_on_user(user, token):
        """Set the stripe customer source for the user given a source token.

        Since this class is responsible for interfacing with our payments
        vendor, it is responsible for setting up the user with a corresponding
        Stripe customer.

        :param user User: the user to set the stripe_customer_id on
        :param token string: the token stripe returned in exchange for payment
            info
        :return bool: indicating whether it was successful or not
        """
        try:
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
        except:
            return False
        else:
            return True
