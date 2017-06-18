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
          <Form.Group widths='equal'>
            <Form.Field control={Input} label="" placeholder="Username"/>
            <Form.Field control={Input} label="" placeholder="Password"/>
            <Form.Field control={Button}>Submit</Form.Field>
          </Form.Group>
        </Form>
      );
    } else {
      return (
       <Form>
          <Form.Field control={Input} label="" placeholder="Username"/>
          <Form.Field control={Input} label="" placeholder="Password"/>
          <Form.Field control={Button}>Submit</Form.Field>
        </Form>
      );
    }
  }
}
