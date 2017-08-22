import StripeCheckout from 'react-stripe-checkout';
import * as React from 'react';

import * as Actions from '../Actions/Index';
import CeraonDispatcher from '../Store/CeraonDispatcher';
import CeraonModel from '../Services/CeraonModel';

export default class CardInfoForm extends React.Component<any, any> {
  onToken(token) {
    CeraonDispatcher(Actions.createPaymentInfoUpdatedAction(token.id));
  }

  render() {
    return (
      <StripeCheckout
        name="Mealbound"
        description="Update your payment info"
        panelLabel="Update"
        label="Update Payment Info"
        token={this.onToken}
        stripeKey={CeraonModel.getStripeKey()}
      >
        <button className="ui labeled icon violet button"><i className="credit card icon"></i>Update Payment Info</button>
      </StripeCheckout>
    )
  }
}
