"""Test the Transaction models."""
from unittest.mock import patch

import pytest

from ceraon.models.transactions import Transaction


@pytest.mark.usefixtures('db')
class TestTransaction:
    """Transaction tests."""

    def test_get_by_id(self, meal, host, guest):
        """Get Transaction by id."""
        transaction = Transaction(payer=guest, amount=meal.price, payee=host,
                                  meal=meal)
        transaction.save()

        retrieved = Transaction.find(transaction.id)
        assert retrieved == transaction

    @patch('ceraon.models.transactions.stripe')
    def test_charge_returns_true_without_error(self, stripe_mock, transaction):
        """Test that charge() returns True if no stripe error is raised."""
        assert transaction.charge() is True

    @patch('ceraon.models.transactions.stripe')
    def test_successful_charge_sets_property(self, stripe_mock, transaction):
        """Test that charge() sets transaction_went_through to True."""
        transaction.charge()
        assert transaction.transaction_went_through is True

    @patch('ceraon.models.transactions.stripe')
    def test_failed_charge_returns_false(self, stripe_mock, transaction):
        """Test that charge() returns false if stripe throws an error."""
        stripe_mock.Charge.create.side_effect = RuntimeError('failed charge')
        assert transaction.charge() is False

    @patch('ceraon.models.transactions.stripe')
    def test_failed_charge_doesnt_set_attribute(self, stripe_mock, transaction):
        """Test that a failed charge() doesn't set transaction_went_through."""
        stripe_mock.Charge.create.side_effect = RuntimeError('failed charge')
        transaction.charge()
        assert transaction.transaction_went_through is False

    def test_cancel_sets_canceled(self, transaction):
        """Test that calling cancel() sets the canceled property."""
        transaction.cancel()
        assert transaction.canceled is True

    @patch('ceraon.models.transactions.stripe')
    def test_set_stripe_source_on_user_no_stripe_id(self, stripe_mock, user):
        """Test that setting the stripe customer ID works."""
        customer_id = 'this is the stripe customer id'
        stripe_mock.Customer.create.return_value.id = customer_id
        Transaction.set_stripe_source_on_user(user=user, token='some token')
        assert user.stripe_customer_id == customer_id

    @patch('ceraon.models.transactions.stripe')
    def test_set_stripe_source_on_user_returns_true(self, stripe_mock, user):
        """Test that setting the stripe customer ID returns True."""
        customer_id = 'this is the stripe customer id'
        stripe_mock.Customer.create.return_value.id = customer_id
        assert Transaction.set_stripe_source_on_user(
            user=user, token='some token') is True

    @patch('ceraon.models.transactions.stripe')
    def test_set_stripe_source_on_user_existing_id(self, stripe_mock, user):
        """Test that resetting the stripe customer ID works."""
        customer_id = 'this is the stripe customer id'
        assert user.stripe_customer_id is None
        user.stripe_customer_id = customer_id
        assert Transaction.set_stripe_source_on_user(
            user=user, token='some token') is True
        stripe_mock.Customer.retrieve.assert_called_once()

    @patch('ceraon.models.transactions.stripe')
    def test_set_stripe_source_on_user_fail(self, stripe_mock, user):
        """Test that a stripe failure returns false."""
        stripe_mock.Customer.create.side_effect = RuntimeError('stripe error')
        assert Transaction.set_stripe_source_on_user(
            user=user, token='some token') is False
