import * as React from 'react';
import {Menu, Input} from 'semantic-ui-react';
import UserSessionInfo from '../State/Identity/UserSessionInfo';
import NavigationBarState from '../State/NavigationBarState';
import LoginForm from './LoginForm';
import CeraonDispatcher from '../Store/CeraonDispatcher';
import CreateLoginAction from '../Actions/LoginAction';
import CreateGoHomeAction from '../Actions/GoHomeAction';

export interface NavigationBarProps extends NavigationBarState, React.Props<NavigationBar> {
}

export default class NavigationBar extends React.Component<NavigationBarProps, any> {
  constructor() {
    super();

    this.onCreateAccount = this.onCreateAccount.bind(this);
    this.onSearchTextInput = this.onSearchTextInput.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onGoHome = this.onGoHome.bind(this);
  }

  onCreateAccount() {

  }

  onSearchTextInput() {

  }

  onGoHome() {
    CeraonDispatcher(CreateGoHomeAction());
  }

  onLogin(username: string, password: string) {
    CeraonDispatcher(CreateLoginAction(username, password));
  }

  render() {
    return (
      <Menu fixed="top">
        <Menu.Item header onClick={this.onGoHome}>{this.props.navigationTitle}</Menu.Item>
        { this.props.showSearchBox ? (
          <Menu.Item>
            <Input className='icon' icon='search' placeholder='Search...' onChange={this.onSearchTextInput}/>
          </Menu.Item>
        ) : (<div/>)}
        <Menu.Item position='right'/>
        { this.props.showLoginUI ? (
        <Menu.Item>
            <LoginForm direction="horizontal" onLogin={this.onLogin}/>
        </Menu.Item>
        ) : (<div/>)}
        { this.props.showCreateAccountButton ? (
        <Menu.Item onClick={this.onCreateAccount}>Create Account</Menu.Item>
        ) : (<div/>)}
        { this.props.showLoggedInText ? (
        <Menu.Item>{this.props.loggedInText}</Menu.Item>
        ) : (<div/>)}
        { this.props.showSettingsDropdown ? (
        <Menu.Item>SettingsDropdown</Menu.Item>
        ) : (<div/>)}
      </Menu>
    );
  }
}
