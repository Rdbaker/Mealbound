import * as React from 'react';
import {Form, Input, Button} from 'semantic-ui-react';

interface LoginFormProps extends React.Props<LoginForm> {
  direction: 'vertical'|'horizontal';
}

interface LoginFormState {
  username: string;
  password: string;
}

export default class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
  constructor() {
    super();
    this.state = {username: '', password: ''};
  }

  render() {
    if (this.props.direction == 'horizontal') {
      return (
        <Form>
          <Form.Group widths='equal' className='no-margin'>
            <Form.Input placeholder="Username"/>
            <Form.Input type="password" placeholder="Password"/>
            <Form.Button>Submit</Form.Button>
          </Form.Group>
        </Form>
      );
    } else {
      return (
       <Form>
          <Form.Input placeholder="Username"/>
          <Form.Input type="password" label="" placeholder="Password"/>
          <Form.Button>Submit</Form.Button>
        </Form>
      );
    }
  }
}
