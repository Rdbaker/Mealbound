import * as React from 'react';

import CeraonDispatcher from '../Store/CeraonDispatcher';
import * as Actions from '../Actions/Index';
import ErrorModal from '../Components/ErrorModal';
import UserSessionInfo from '../State/Identity/UserSessionInfo';

export interface NotAuthorizedPageProps extends React.Props<NotAuthorizedPage> {
  userSessionInfo: UserSessionInfo;
}

export default class NotAuthorizedPage extends React.Component<NotAuthorizedPageProps, undefined> {
  constructor() {
    super();
  }

  render() {

    let actionMessage = 'Head back home?';
    let action = () => { CeraonDispatcher(Actions.createGoHomeAction())};

    if (!this.props.userSessionInfo.isUserAuthenticated) {
      actionMessage = 'Login or Register';
      action = () => { window.location.href = '/login/' };
    }

    

    return (
      <ErrorModal
        errorMessageHeader='Sorry! You dont have permission to do that.'
        errorMessageSubheader=''
        errorIcon='warning'
        actionMessage={actionMessage}
        action={action}/>
    );
  }
}