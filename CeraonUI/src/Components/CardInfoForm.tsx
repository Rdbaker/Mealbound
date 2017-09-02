import StripeCheckout from 'react-stripe-checkout';
import { Button } from 'semantic-ui-react';
import * as React from 'react';

import * as Actions from '../Actions/Index';
import CeraonDispatcher from '../Store/CeraonDispatcher';
import CeraonModel from '../Services/CeraonModel';

interface CardInfoFormProps {
  stripeCheckoutName?: string;
  triggerBtnColor?: string;
  triggerBtnIcon?: string;
  stripeCheckoutDescription: string;
  stripeCheckoutPanelLabel: string;
  stripeCheckoutLabel: string;
  stripeCheckoutOnToken: (stripeToken: string) => void;
  stripeSubmitBtnText: string;
}

export default class CardInfoForm extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.stripeCheckoutName || "Mealbound",
      triggerBtnColor: this.props.triggerBtnColor || "violet",
      triggerBtnIcon: this.props.triggerBtnIcon,
      description: this.props.stripeCheckoutDescription,
      panelLabel: this.props.stripeCheckoutPanelLabel,
      label: this.props.stripeCheckoutLabel,
      onToken: this.props.stripeCheckoutOnToken,
      submitBtnText: this.props.stripeSubmitBtnText
    };
  }

  hasTriggerBtnIcon() {
    if (this.state.triggerBtnIcon) {
      return "labeled icon";
    } else {
      return "";
    }
  }

  getTriggerBtnIcon() {
    if (this.state.triggerBtnIcon) {
      return ( <i className={this.state.triggerBtnIcon}></i> );
    } else {
      return null;
    }
  }

  render() {
    return (
      <StripeCheckout
        name={this.state.name}
        description={this.state.description}
        panelLabel={this.state.panelLabel}
        label={this.state.label}
        token={this.state.onToken}
        stripeKey={CeraonModel.getStripeKey()}
      >
        <Button
         color={this.state.triggerBtnColor}
         className={`${this.hasTriggerBtnIcon()}`}
         disabled={this.props.triggerBtnDisabled}
         loading={this.props.triggerBtnLoading}
        >
          {this.getTriggerBtnIcon()}
          {this.state.submitBtnText}
        </Button>
      </StripeCheckout>
    )
  }
}
