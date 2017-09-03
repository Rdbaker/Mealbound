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
  }

  onMealSearch(mealTime: MealTime) {
    CeraonDispatcher(Actions.createMealSearchAction({mealTime: mealTime, textFilter: []}));
  }

  render() {
    let mealInfo = <div/>;

    if (this.props.showMyMealInfo) {
      if (this.props.myMealInfoLoading) {
        mealInfo = <LoadingSpinner loadingStatusMessage=''/>
      } else {
        mealInfo = (
        <Segment.Group style={{border:'none', boxShadow:'0 0'}}>
          { this.props.myJoinedMeals.length == 0 ?
            <div/> :
            (
              <Segment basic className='home-page-meals'>
                <Header as='h3' textAlign='center'>
                  <Header.Content>
                    Meals You've Joined
                  </Header.Content>
                  <div className='meal-card-grid'>
                    {this.props.myJoinedMeals.map((meal: Meal) =>
                      <MealCard
                        key={meal.id}
                        meal={meal}
                        mealCardMode={MealCardMode.Summary}
                        onClick={(meal: Meal)=>CeraonDispatcher(Actions.createViewMealAction(meal.id))}/>
                    )}
                  </div>
                </Header>
              </Segment>
            )
          }
          { this.props.myHostedMeals.length == 0 ?
            <div/> :
            (
              <Segment basic className='home-page-meals'>
                <Header as='h3' textAlign='center'>
                  <Header.Content>
                      Meals You're Hosting
                  </Header.Content>
                    <div className='meal-card-grid'>
                      {this.props.myHostedMeals.map((meal: Meal) =>
                        <MealCard key={meal.id}
                          meal={meal}
                          mealCardMode={MealCardMode.Summary}
                          onClick={(meal: Meal)=>CeraonDispatcher(Actions.createViewMealAction(meal.id))}/>
                        )}
                    </div>
                </Header>
              </Segment>
            )
          }
        </Segment.Group>
        );
      }
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
