import * as React from 'react';

export default class AppHost extends React.Component<any, any> {
  constructor() {
    super();
  }

  render() {
    return (
      React.Children.only(this.props.children)
    );
  }
}
