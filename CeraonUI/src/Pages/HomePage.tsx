import * as React from 'react';

import {Segment, Header, Icon} from 'semantic-ui-react';
import HomePageState from '../State/Pages/HomePageState';
import MealSearchDropdown from '../Components/MealSearchDropdown';
import { MealTime, MealTimeFilter } from '../State/Meal/Filters/MealTime';
import CeraonDispatcher from '../Store/CeraonDispatcher';
import CreateMealSearchAction, {MealSearchActionType} from '../Actions/MealSearchAction';

export interface HomePageProps extends HomePageState, React.Props<HomePage> {
  
}

export default class HomePage extends React.Component<HomePageProps, {}> {
  constructor() {
    super();
    this.onMealSearch = this.onMealSearch.bind(this);
  }

  onMealSearch(mealTime: MealTime) {
    CeraonDispatcher(CreateMealSearchAction(MealSearchActionType.AddFilter,
      [new MealTimeFilter(mealTime)]));
  }

  render() {
    return (
      <Header as='h2' icon textAlign='center'>
        <Icon name='food' circular />
        <Header.Content>
          {this.props.headerMessage}
          <MealSearchDropdown mealTimeOptions={this.props.searchMealTimeOptions} onSearchClicked={this.onMealSearch} />
        </Header.Content>
      </Header>
    )
  }
}