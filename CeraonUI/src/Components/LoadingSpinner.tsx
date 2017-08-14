import * as React from 'react';

import { Loader, Dimmer } from 'semantic-ui-react';

export interface LoadingSpinnerProps extends React.Props<LoadingSpinner> {
  loadingStatusMessage: string;
}

export default class LoadingSpinner extends React.Component<LoadingSpinnerProps, {}> {
  constructor() {
    super();
  }

  render() {
    return <Loader className='loading-spinner' active inline='centered' size='huge'>{this.props.loadingStatusMessage}</Loader>;
  }

}