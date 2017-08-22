import * as React from 'react';

import { Segment, Header, Button, Message } from 'semantic-ui-react';
import CeraonDispatcher from '../Store/CeraonDispatcher';
import * as Actions from '../Actions/Index';
import UserIdentity, { UserIdentityUpdateModel } from '../State/Identity/UserIdentity';
import * as isEmail from 'isemail';
import SettingsPageState from '../State/Pages/SettingsPageState';
import CardInfoForm from '../Components/CardInfoForm';

interface SettingsPageOwnState {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
  firstNameError: boolean;
  lastNameError: boolean;
  emailError: boolean;
  passwordError: boolean;
  isSubmitEnabled: boolean;
}

interface SettingsPageProps extends SettingsPageState, UserIdentity {

}

export default class SettingsPage extends React.Component<SettingsPageProps, SettingsPageOwnState> {
  constructor(props: SettingsPageProps) {
    super(props);
    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.onAddressChange = this.onAddressChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onPasswordConfirmChange = this.onPasswordConfirmChange.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);

    let state : SettingsPageOwnState = {
      firstName: this.props.first_name,
      lastName: this.props.last_name,
      email: this.props.email,
      address: this.props.address,
      password: '',
      confirmPassword: '',
      isSubmitEnabled: false,
      passwordError: false,
      firstNameError: false,
      lastNameError: false,
      emailError: false
    }

    state.isSubmitEnabled = this.isSubmitEnabled(state);

    this.state = state;
  }

  private onFirstNameChange(event) {
    let value = event.target.value;
    this.setState({
      firstName: value,
      firstNameError: value.length == 0,
      isSubmitEnabled: this.isSubmitEnabledPartial({firstName: value}),
    });
  }

  private onLastNameChange(event) {
    let value = event.target.value;
    this.setState({
      lastName: value, 
      lastNameError: value.length == 0,
      isSubmitEnabled: this.isSubmitEnabledPartial({lastName: value})
    });
  }

  private onAddressChange(event) {
    let value = event.target.value;
    this.setState({address: value, isSubmitEnabled: this.isSubmitEnabledPartial({address: value})});
  }

  private onEmailChange(event) {
    let value = event.target.value;
    this.setState({
      email: value,
      emailError: value.length == 0 || !isEmail.validate(value),
      isSubmitEnabled: this.isSubmitEnabledPartial({email: value})
    });
  }

  private onPasswordChange(event) {
    let value = event.target.value;
    this.setState({
      password: value,
      passwordError: value != this.state.confirmPassword || value.length < 10,
      isSubmitEnabled: this.isSubmitEnabledPartial({password: value})
    });
  }

  private onPasswordConfirmChange(event) {
    let value = event.target.value;
    this.setState({
      confirmPassword: value,
      passwordError: value != this.state.password || value.length < 10,
      isSubmitEnabled: this.isSubmitEnabledPartial({confirmPassword: value})
    });
  }

  private isSubmitEnabledPartial(state: Partial<SettingsPageOwnState>): boolean {
    let newState = Object.assign(this.state, state);

    return this.isSubmitEnabled(newState);
  }
  
  private isSubmitEnabled(state: SettingsPageOwnState) : boolean {
    return state.firstName.length > 0
      && state.lastName.length > 0
      && state.email.length > 0 
      && isEmail.validate(state.email)
      && state.password == state.confirmPassword
      && (!state.password || state.password.length >= 10);
  }

  private onSubmitForm() {
    let updateModel: Partial<UserIdentityUpdateModel> = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      address: this.state.address,
    };

    if (this.state.password.length > 0) {
      updateModel.password = this.state.password;
      updateModel.confirm_pw = this.state.confirmPassword;
    }

    CeraonDispatcher(Actions.createUpdateUserAction(updateModel));
  }

  render() {
    let firstNameClass = this.state.firstNameError ? 'field error' : 'field';
    let lastNameClass = this.state.lastNameError ? 'field error' : 'field';
    let emailClass = this.state.emailError ? 'field error' : 'field';
    let passwordClass = this.state.passwordError ? 'field error' : 'field';

    return (
      <div className='ui stackable grid form-page'>
        <div className='column form'>
          <Segment>
            <Header size='large' content='Update Your Profile' />
            <div className='ui form'>
              <div className={firstNameClass}>
                <label>First Name*</label>
                <input type='text'
                      placeholder='First Name'
                      name='first-name'
                      value={this.state.firstName}
                      onChange={this.onFirstNameChange}
                      disabled={this.props.isUpdating}/>
              </div>
              <div className={lastNameClass}>
                <label>Last Name*</label>
                <input type='text'
                      placeholder='Last Name'
                      name='last-name'
                      value={this.state.lastName}
                      onChange={this.onLastNameChange}
                      disabled={this.props.isUpdating}/>
              </div>
              <div className={emailClass}>
                <label>Email*</label>
                <input type='text'
                      placeholder='Email'
                      name='email'
                      value={this.state.email}
                      onChange={this.onEmailChange}
                      disabled={this.props.isUpdating}/>
              </div>
              <div className='field'>
                <label>Address</label>
                <input type='text'
                      placeholder='Address'
                      name='last-name'
                      value={this.state.address}
                      onChange={this.onAddressChange}
                      disabled={this.props.isUpdating}/>
              </div>
              <div className={passwordClass}>
                <label>Password</label>
                <input type='password'
                      placeholder='Password'
                      name='password'
                      value={this.state.password}
                      onChange={this.onPasswordChange}
                      disabled={this.props.isUpdating}/>
                <span>Password must be at least 10 characters.</span>
              </div>
              <div className={passwordClass}>
                <label>Confirm Password</label>
                <input type='password'
                      placeholder='Confirm password'
                      name='confirm-password'
                      value={this.state.confirmPassword}
                      onChange={this.onPasswordConfirmChange}
                      disabled={this.props.isUpdating}/>
              </div>
              <div className="field">
                <CardInfoForm></CardInfoForm>
              </div>
              <Button onClick={this.onSubmitForm}
                disabled={!this.state.isSubmitEnabled}
                loading={this.props.isUpdating}
                className="positive">
                Update Settings
              </Button>
              { this.props.updatedMessage }
            </div>
          </Segment>
        </div>
      </div>);
  }
}
