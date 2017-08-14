import * as React from 'react';

import { Header, Icon, Modal, Button } from 'semantic-ui-react';

interface ErrorModalProps extends React.Props<ErrorModal> {
  errorMessageHeader: string;
  errorMessageSubheader: string;
  errorIcon: string;
  actionMessage: string;
  action: ()=>void;
}

export default class ErrorModal extends React.Component<ErrorModalProps, undefined> {
  constructor() {
    super();
  }

  render() {
    return (
      <Modal defaultOpen={true} closeOnEscape={false} closeOnDimmerClick={false} basic size='small'>
        <Header icon={this.props.errorIcon} content={this.props.errorMessageHeader} />
        <Modal.Content>
          {this.props.errorMessageSubheader}
        </Modal.Content>
        <Modal.Actions>
          <Button basic color='green' inverted onClick={this.props.action}>
            {this.props.actionMessage}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}