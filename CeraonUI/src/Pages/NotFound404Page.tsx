import * as React from 'react';

import CeraonDispatcher from '../Store/CeraonDispatcher';
import * as Actions from '../Actions/Index';
import ErrorModal from '../Components/ErrorModal';

export default class NotFound404Page extends React.Component<undefined, undefined> {
  constructor() {
    super();
  }

  render() {
    return (
      <ErrorModal
        errorMessageHeader='Oops! You seem to have gotten lost.'
        errorMessageSubheader='The page you were looking for was either moved or never existed.'
        errorIcon='warning'
        actionMessage='Head back home?'
        action={()=>{CeraonDispatcher(Actions.createGoHomeAction())}}/>
    );
  }
}