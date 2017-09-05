import * as React from 'react';

import { Header, Icon, Divider, Segment } from 'semantic-ui-react';
import HomePageState from '../State/Pages/HomePageState';
import MealSearchDropdown from '../Components/MealSearchDropdown';
import MealTime from '../State/Meal/Filters/MealTime';
import CeraonDispatcher from '../Store/CeraonDispatcher';
import LoadingSpinner from '../Components/LoadingSpinner';
import MealCard, { MealCardMode } from '../Components/MealCard';
import Meal from '../State/Meal/Meal';
import * as Actions from '../Actions/Index';

export interface HomePageProps extends HomePageState, React.Props<HomePage> {

}

export default class HomePage extends React.Component<HomePageProps, {}> {
  constructor() {
    super();
    this.onMealSearch = this.onMealSearch.bind(this);
    this.joinNewMeal = this.joinNewMeal.bind(this);
    this.createNewMeal = this.createNewMeal.bind(this);
  }

  joinNewMeal() {
    this.onMealSearch(MealTime.Any);
  }

  createNewMeal() {
    CeraonDispatcher(Actions.createGoToCreateMealAction());
  }

  onMealSearch(mealTime: MealTime) {
    CeraonDispatcher(Actions.createMealSearchAction({mealTime: mealTime, textFilter: []}));
  }

  renderMyHostMeals() {
    if (this.props.hostedMealsLoading) {
      return <LoadingSpinner loadingStatusMessage='finding your hosted meals...'/>
    }

    let segmentContent = <div>You haven't hosted any meals. <a href="javascript:void(0)" onClick={this.createNewMeal}>Host one now!</a></div>

    if (this.props.myHostedMeals.length > 0) {
      segmentContent = (
        <div className='meal-card-grid'>
          {this.props.myHostedMeals.map((meal: Meal) =>
            <MealCard
              key={meal.id}
              meal={meal}
              mealCardMode={MealCardMode.Summary}
              onClick={(meal: Meal)=>CeraonDispatcher(Actions.createViewMealAction(meal.id))}/>
          )}
        </div>
      );
    }

    return (<Segment basic className='home-page-meals' textAlign='center'>
      <Header as='h3'>
        <Header.Content>
            Meals You're Hosting
        </Header.Content>
      </Header>
      {segmentContent}
    </Segment>);
  }

  renderMyGuestMeals() {
    if (this.props.joinedMealsLoading) {
      return <LoadingSpinner loadingStatusMessage='finding meals you joined...'/>
    }

    let segmentContent = <div>You haven't joined any meals. <a href="javascript:void(0)" onClick={this.joinNewMeal}>Find one now!</a></div>

    if (this.props.myJoinedMeals.length > 0) {
      segmentContent = (
        <div className='meal-card-grid'>
          {this.props.myJoinedMeals.map((meal: Meal) =>
            <MealCard
              key={meal.id}
              meal={meal}
              mealCardMode={MealCardMode.Summary}
              onClick={(meal: Meal)=>CeraonDispatcher(Actions.createViewMealAction(meal.id))}/>
          )}
        </div>
      );
    }

    return (<Segment basic className='home-page-meals' textAlign='center'>
      <Header as='h3'>
        <Header.Content>
          Meals You've Joined
        </Header.Content>
      </Header>
      {segmentContent}
    </Segment>);
  }

  render() {
    let mealInfo = <div/>;

    if (this.props.showMyMealInfo) {
      mealInfo = (
      <Segment.Group style={{border:'none', boxShadow:'0 0'}}>
        {this.renderMyGuestMeals()}
        {this.renderMyHostMeals()}
      </Segment.Group>
      );
    }

    return (
      <div>
        <Header as='h2' icon textAlign='center'>
          <Icon name='food' circular />
          <Header.Content>
            {this.props.headerMessage}
            <MealSearchDropdown
              dropdownHeader={this.props.mealSearchDropdownText}
              onSearchClicked={this.onMealSearch} />
          </Header.Content>
        </Header>
        { this.props.showMyMealInfo ?
           <Divider/>
           : <div/> }
        {mealInfo}
      </div>
    )
  }
}
