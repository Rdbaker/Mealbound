import * as React from 'react';

export default class AppHost extends React.Component<any, any> {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
