import * as React from 'react';

import { Menu, Button } from 'semantic-ui-react';
import ViewMealPageState from '../State/Pages/ViewMealPageState';
import CeraonDispatcher from '../Store/CeraonDispatcher';
import MealCard, { MealCardMode } from '../Components/MealCard';
import LoadingSpinner from '../Components/LoadingSpinner';
import * as Actions from '../Actions/Index';
import ErrorModal from '../Components/ErrorModal';
import * as Moment from 'moment';
import UrlProvider from '../Services/UrlProvider';
import CardInfoForm from '../Components/CardInfoForm';

export interface ViewMealPageProps extends ViewMealPageState, React.Props<ViewMealPage> {

}

export default class ViewMealPage extends React.Component<ViewMealPageProps, undefined> {
  constructor() {
    super();
    this.toggleJoined = this.toggleJoined.bind(this);
    this.joinMeal = this.joinMeal.bind(this);
  }

  toggleJoined() {
    CeraonDispatcher(Actions.createToggleJoinMealAction(this.props.mealId, !this.props.meal.joined));
  }

  joinMeal(token) {
    CeraonDispatcher(Actions.createToggleJoinMealAction(this.props.mealId, !this.props.meal.joined, token.id));
  }

  private getViewMealMenuControls() : JSX.Element[] {
    let mealIsInFuture = Moment(this.props.meal.scheduled_for).isAfter(Moment.now());

    if (mealIsInFuture) {
      return this.getViewMealMenuControlsFutureMeal();
    } else {
      return this.getViewMealMenuControlsPastMeal();
    }
  }

  private getViewMealMenuControlsFutureMeal() : JSX.Element[] {
    let menuControls = [];
    if (this.props.showUserLoginPrompt) {
        menuControls = [
          <Menu.Item key={1} content='Want to join this meal?'/>,
          <Menu.Item key={2}><Button>Login or Register</Button></Menu.Item>
        ];
      } else if (this.props.meal.mine) {
        menuControls = [
          <Menu.Item key = {1} content="You're hosting this meal"/>,
          <Menu.Item key={3}>
            <Button className='meal-action-button'
                    href={UrlProvider.getEditMealUrl(this.props.mealId)}
                    onClick={(event)=>{event.preventDefault(); CeraonDispatcher(Actions.createGoToEditMealAction(this.props.mealId))}}>
                    Edit Meal
            </Button>
          </Menu.Item>,
          <Menu.Item key={2}>
            <Button className='meal-action-button'
                    loading={this.props.isCancelPending}
                    disabled={this.props.isCancelPending}
                    onClick={()=>CeraonDispatcher(Actions.createCancelMealAction(this.props.mealId))}
                    color='red'>
                    Cancel Meal
            </Button>
          </Menu.Item>,
        ];
      } else {
        if (this.props.meal.joined) {
          menuControls = [
            <Menu.Item key={1} content="You've joined this meal!"/>,
            <Menu.Item key={2}>
              <Button onClick={this.toggleJoined}
                      disabled={this.props.isToggleJoinPending}
                      loading={this.props.isToggleJoinPending}
                      color='red'>
                      Leave Meal
              </Button>
            </Menu.Item>
          ];
        } else {
          menuControls = [
            <Menu.Item key={1}>
              <CardInfoForm
                stripeCheckoutDescription="Confirm meal purchase"
                stripeCheckoutPanelLabel="Pay Now"
                stripeCheckoutLabel="Pay Now"
                stripeCheckoutOnToken={this.joinMeal}
                stripeSubmitBtnText="Join Meal"
                triggerBtnColor="green"
                triggerBtnDisabled={this.props.isToggleJoinPending}
                triggerBtnLoading={this.props.isToggleJoinPending}
              ></CardInfoForm>
            </Menu.Item>];
        }
      }

      return menuControls;
  }

  private getViewMealMenuControlsPastMeal() : JSX.Element[] {
    let menuControls = [];
    if (this.props.meal.mine) {
      menuControls = [
        <Menu.Item key = {1} content="You've already hosted this meal in the past."/>,
      ];
    } else {
      menuControls = [
        <Menu.Item key = {1} content="This meal has already occurred"/>,
      ];
    }

    return menuControls;
  }

  render() {
    if (this.props.isLoading) {
      return <LoadingSpinner loadingStatusMessage={'Finding the meal..'}/>
    } else if (this.props.failedToFindMeal || !this.props.meal) {
      return <ErrorModal errorIcon='question circle'
                        errorMessageHeader="Sorry, this meal doesn't exist!"
                        errorMessageSubheader="We couldn't find the meal you were looking for. The host may have cancelled it, or it may never have existed!" 
                        actionMessage='Head Home?'
                        action={()=> CeraonDispatcher(Actions.createGoHomeAction())}
                        />
    } else {
      let menuControls = this.getViewMealMenuControls();
      return (
        <div className='ui stackable grid view-meal-page'>
          <div className='column view-meal-meal'>
            <MealCard meal={this.props.meal} mealCardMode={MealCardMode.Full}/>
          </div>
          <div className='column view-meal-controls'>
            <div className='ui menu vertical stackable right'>
              {menuControls}
            </div>
          </div>
        </div>
      )
    }
  }
}
