import * as React from 'react';

import { Menu, Input, Container, Checkbox } from 'semantic-ui-react';
import SearchPageState from '../State/Pages/SearchPageState';
import MealSearchFilter, { MealSearchFilterType } from '../State/Meal/Filters/MealSearchFilter';

import { MealTime, MealTimeFilter } from '../State/Meal/Filters/MealTime';
import CeraonDispatcher from '../Store/CeraonDispatcher';
import CreateMealSearchAction, {MealSearchActionType} from '../Actions/MealSearchAction';

import MealCard from '../Components/MealCard';

export interface SearchPageProps extends SearchPageState, React.Props<SearchPage> {

}

export default class SearchPage extends React.Component<SearchPageProps, {}> {
  constructor() {
    super();
    this.onMealTimeClicked = this.onMealTimeClicked.bind(this);
  }

  onMealTimeClicked(event: any, data: any) {
    CeraonDispatcher(CreateMealSearchAction(data.checked ? 
      MealSearchActionType.AddFilter 
      : MealSearchActionType.RemoveFilter,
      new MealTimeFilter(data.value as MealTime)));
  }

  render() {
    let isBreakfastChecked = false;
    let isLunchChecked = false;
    let isDinnerChecked = false;

    for (let filter of this.props.filters) {
      if (filter.getFilterType() == MealSearchFilterType.Time) {
        switch((filter as MealTimeFilter).mealTime) {
          case MealTime.Any:
            isBreakfastChecked = true;
            isLunchChecked = true;
            isDinnerChecked = true;
            break;
          case MealTime.Breakfast:
            isBreakfastChecked = true;
            break;
          case MealTime.Lunch:
            isLunchChecked = true;
            break;
          case MealTime.Dinner:
            isDinnerChecked = true;
            break;
        }
      }
    }

    let resultCards = [];

    for (let result of this.props.results) {
      resultCards.push(<MealCard meal={result}/>)
    }

    return (
      <Container className='search-page-wrapper'>
        <Menu className='search-page-filters' fixed='left' vertical>
          <Menu.Item>
            <Input placeholder='Filter...'/>
          </Menu.Item>
          <Menu.Item>
            <Menu.Header>Meal Time</Menu.Header>
            <Menu.Item>
              <Checkbox label='Breakfast' defaultChecked={isBreakfastChecked} onChange={this.onMealTimeClicked} value={MealTime.Breakfast}/>
            </Menu.Item>
            <Menu.Item>
              <Checkbox label='Lunch' defaultChecked={isLunchChecked} onChange={this.onMealTimeClicked} value={MealTime.Lunch}/>
            </Menu.Item>
            <Menu.Item>
              <Checkbox label='Dinner' defaultChecked={isDinnerChecked} onChange={this.onMealTimeClicked} value={MealTime.Dinner}/>
            </Menu.Item>
          </Menu.Item>
          <Menu.Item>
            <Menu.Header>Meal Location</Menu.Header>
          </Menu.Item>
          <Menu.Item>
            <Menu.Header>Food Type</Menu.Header>
          </Menu.Item>
          <Menu.Item>
            <Menu.Header>Price</Menu.Header>
          </Menu.Item>
        </Menu>
        <div className='search-results-wrapper'>
          {resultCards}
        </div>
      </Container>
    )
  }
}