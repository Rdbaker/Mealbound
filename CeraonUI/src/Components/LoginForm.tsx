import * as React from 'react';
import { Form, Input, Button } from 'semantic-ui-react';

interface LoginFormProps extends React.Props<LoginForm> {
  direction: 'vertical'|'horizontal';
  onLogin: (email: string, password: string) => void;
}

interface LoginFormState {
  email: string;
  password: string;
  isSubmitEnabled: boolean;
}

export default class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
  constructor() {
    super();
    this.state = {email: '', password: '', isSubmitEnabled: false};
    this.onUsernameChanged = this.onUsernameChanged.bind(this);
    this.onPasswordChanged = this.onPasswordChanged.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onUsernameChanged(event: any) {
    let email = event.target.value;
    let isSubmitEnabled = email.length > 0 && this.state.password.length > 0;

    this.setState({email: email, isSubmitEnabled: isSubmitEnabled});
  }

  onPasswordChanged(event: any) {
    let password = event.target.value;
    let isSubmitEnabled = password.length > 0 && this.state.email.length > 0;

    this.setState({password: password, isSubmitEnabled: isSubmitEnabled});
  }

  onSubmit() {
    this.props.onLogin(this.state.email, this.state.password);
    this.setState({email:'', password:'', isSubmitEnabled: false});
  }

  render() {
    if (this.props.direction == 'horizontal') {
      return (
        <div className="ui form">
          <Form.Group widths='equal' className='no-margin'>
            <Form.Input placeholder="Username" onChange={this.onUsernameChanged} value={this.state.email}/>
            <Form.Input type="password" placeholder="Password" onChange={this.onPasswordChanged} value={this.state.password}/>
            <Form.Button disabled={!this.state.isSubmitEnabled}
              onClick={this.onSubmit}>Login</Form.Button>
          </Form.Group>
        </div>
      );
    } else {
      return (
       <div className="ui form">
          <Form.Input placeholder="Username" onChange={this.onUsernameChanged} value={this.state.email}/>
          <Form.Input type="password" label="" placeholder="Password" onChange={this.onPasswordChanged} value={this.state.password}/>
          <Form.Button disabled={!this.state.isSubmitEnabled}
            onClick={this.onSubmit}>Login</Form.Button>
        </div>
      );
    }
  }
}
