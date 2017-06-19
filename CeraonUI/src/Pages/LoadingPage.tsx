import * as React from 'react';

import { Loader, Dimmer } from 'semantic-ui-react';
import LoadingPageState from '../State/Pages/LoadingPageState';

export interface LoadingPageProps extends LoadingPageState, React.Props<LoadingPage> {
  
}

export default class LoadingPage extends React.Component<LoadingPageProps, {}> {
  constructor() {
    super();
  }

  render() {
    return (
    <Dimmer active inverted>
      <Loader active inline='centered' size='huge'>{this.props.loadingStatusMessage}</Loader>
    </Dimmer>)
  }

}