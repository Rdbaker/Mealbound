import * as React from 'react';

import CeraonDispatcher from '../Store/CeraonDispatcher';
import UserIdentity from '../State/Identity/UserIdentity';
import Tag from '../State/Meal/Tag';
import { Button, Segment, Header } from 'semantic-ui-react';
import MealForm from '../Components/MealForm';
import CreateMealPageState from '../State/Pages/CreateMealPageState';
import * as Actions from '../Actions/Index';
import * as Moment from 'moment';
import LoadingSpinner from '../Components/LoadingSpinner';

interface CreateMealPageOwnState {
  isChangeAddressEnabled: boolean;
  addressText: string;
}

export default class CreateMealPage extends React.Component<CreateMealPageState, CreateMealPageOwnState> {
  constructor() {
    super();
    this.state = {isChangeAddressEnabled: false, addressText: ''};

    this.onAddressChange = this.onAddressChange.bind(this);
    this.onAddressEnter = this.onAddressEnter.bind(this);
    this.onAddressSubmit = this.onAddressSubmit.bind(this);
  }

  private onAddressChange(event) {
    let addressValue = event.target.value;
    this.setState({addressText: addressValue, isChangeAddressEnabled: addressValue.length > 0});
  }

  private onAddressEnter(event) {
    let addressValue = this.state.addressText;
    if (addressValue.length > 0 && event.keyCode === 13) {
      this.onAddressSubmit();
    }
  }

  private onAddressSubmit() {
    let userIdentity : Partial<UserIdentity> = {
      address: this.state.addressText,
    }

    this.setState({addressText: '', isChangeAddressEnabled: false});
    CeraonDispatcher(Actions.createUpdateUserAction(userIdentity));
  }

  private onCreateMeal(title: string, descr: string, time: string, price: number, maxGuests: number, mealTags: Tag[]) {
    CeraonDispatcher(Actions.createCreateMealAction({
      name: title,
      description: descr,
      scheduled_for: time,
      price: price,
      max_guests: maxGuests,
      tags: mealTags,
    }));
  }

  render() {
    let pageContent = <div/>

    if (!this.props.showAddLocationPrompt) {
      if (this.props.isCreateLoading) {
        pageContent = <LoadingSpinner loadingStatusMessage='Creating your meal...'/>
      } else {
        pageContent = <MealForm
                        headerText='Host a new meal'
                        onSubmit={this.onCreateMeal}
                        submitText='Host Meal'
                        mealTagOptions={this.props.mealTagOptions}/>
      }
    } else {
      pageContent = (
        <Segment>
          <Header size='large' content='Add your address to start hosting meals' />
          <div className='ui action input'>
            <input type='text' placeholder='Address' name='address'
              value={this.state.addressText}
              onKeyUp={this.onAddressEnter}
              onChange={this.onAddressChange}
              disabled={this.props.isUserUpdateLoading}/>
            <Button className='ui button button'
              onClick={this.onAddressSubmit}
              loading={this.props.isUserUpdateLoading}
              disabled={!this.state.isChangeAddressEnabled}>Update</Button>
          </div>
        </Segment>
      );
    }

    return (
        <div className='ui stackable grid form-page'>
          <div className='column form'>
            { pageContent }
          </div>
        </div>
    );
  }
}