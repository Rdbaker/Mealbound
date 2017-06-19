import * as React from 'react';

import HomePageState from '../State/HomePageState';

export interface HomePageProps extends HomePageState, React.Props<HomePage> {
  
}

export default class HomePage extends React.Component<HomePageProps, {}> {
  constructor() {
    super();
  }

  render() {
    return (
    <div/>
    )
  }
}