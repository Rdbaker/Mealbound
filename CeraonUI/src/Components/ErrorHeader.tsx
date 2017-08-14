import * as React from 'react';

import { Header, Icon } from 'semantic-ui-react';

interface ErrorHeaderProps extends React.Props<ErrorHeader> {
  errorMessage: string;
  actionMessage: string;
  action: ()=>void;
}

export default class ErrorHeader extends React.Component<ErrorHeaderProps, undefined> {
  constructor() {
    super();
  }

  render() {
    return (
      <Header as='h2' icon textAlign='center'>
        <Icon name='warning' />
        {this.props.errorMessage}
        <Header.Subheader>
          <a onClick={this.props.action}>{this.props.actionMessage}</a>
        </Header.Subheader>
      </Header>
    );
  }
}