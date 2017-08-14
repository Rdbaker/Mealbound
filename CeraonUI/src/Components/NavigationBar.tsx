import * as React from 'react';
import UserSessionInfo from '../State/Identity/UserSessionInfo';
import NavigationBarState from '../State/NavigationBarState';
import LoginForm from './LoginForm';
import CeraonDispatcher from '../Store/CeraonDispatcher';
import * as Actions from '../Actions/Index';
import UrlProvider from '../Services/UrlProvider';
import { Dropdown } from 'semantic-ui-react';
import MealTime from '../State/Meal/Filters/MealTime';

export interface NavigationBarProps extends NavigationBarState, React.Props<NavigationBar> {
  onNavigationHeightChanged: (newHeight: number) => void;
}

interface NavigationBarInternalState {
  searchValue: string;
}

export default class NavigationBar extends React.Component<NavigationBarProps, NavigationBarInternalState> {
  constructor() {
    super();

    this.onSearchTextInput = this.onSearchTextInput.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onGoHome = this.onGoHome.bind(this);
    this.onSizeChange = this.onSizeChange.bind(this);
    this.onSearchTextEnter = this.onSearchTextEnter.bind(this);

    this.state = {searchValue: ''};
  }

  private _divElement : HTMLDivElement = null;
  private _lastHeight: number;

  onSearchTextEnter(event: any) {
    let searchValue = this.state.searchValue;
    if (searchValue.length > 0 && event.keyCode === 13) {
      this.setState({searchValue: ''});
      CeraonDispatcher(Actions.createMealSearchAction({mealTime: MealTime.Any, textFilter:[searchValue]}));
    }
  }

  onSearchTextInput(event: any) {
    let searchValue = event.target.value;
    this.setState({searchValue: searchValue});
  }

  onGoHome(event: any) {
    event.preventDefault();
    CeraonDispatcher(Actions.createGoHomeAction());
  }

  onLogin(email: string, password: string) {
    CeraonDispatcher(Actions.createLoginAction(email, password));
  }

  onSizeChange() {
    if (!this._divElement) {
      return;
    }

    if (this._lastHeight != this._divElement.clientHeight) {
      this._lastHeight = this._divElement.clientHeight;
      this.props.onNavigationHeightChanged(this._divElement.clientHeight);
    }
  }

  componentDidUpdate() {
    this.onSizeChange();
  }

  componentDidMount() {
    this.onSizeChange();
    window.addEventListener('resize', this.onSizeChange);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onSizeChange);
  }

  render() {
    return (
      <div className="ui stackable top fixed huge menu ceraon-nav-bar" ref={ (divElement) => this._divElement = divElement }>
        <a className="item" href={UrlProvider.getHomePageUrl()} onClick={this.onGoHome}>{this.props.navigationTitle}</a>
        { this.props.showSearchBox ? (
          <div className='item'>
            <div className='ui icon input'>
              <input
                className='prompt'
                type='text'
                placeholder='Search meals...'
                value={this.state.searchValue}
                onChange={this.onSearchTextInput}
                onKeyUp={this.onSearchTextEnter}/>
              <i className='search icon'></i>
            </div>
          </div>
        ) : (<div/>)}
        <div className='right menu'>
        { this.props.showLoginAndCreateAccountButton ? (
          <a className='item' onClick={()=>{window.location.href = "/login/"; }}>Login or Register</a>
        ) : (<div/>)}
        { this.props.showLoggedInText ? (
          <div className='item'>{this.props.loggedInText}</div>
        ) : (<div/>)}
        { this.props.showSettingsDropdown ? (
          <Dropdown item icon='settings'>
            <Dropdown.Menu>
              <Dropdown.Item href={UrlProvider.getCreateMealUrl()} onClick={(event)=> {event.preventDefault(); CeraonDispatcher(Actions.createGoToCreateMealAction())}}>Host Meals</Dropdown.Item>
              <Dropdown.Item href={UrlProvider.getSettingsUrl()} onClick={(event)=> {event.preventDefault(); CeraonDispatcher(Actions.createGoToSettingsAction())}}>Settings</Dropdown.Item>
              <Dropdown.Item href='/logout/' onClick={()=>{window.location.href = '/logout/'; }}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (<div/>)}
        </div>
      </div>
    );
  }
}
