import * as React from 'react';

import { Menu, Container, Checkbox, Icon } from 'semantic-ui-react';
import * as SelectRP from 'react-select-plus';
import SearchPageState from '../State/Pages/SearchPageState';
import MealSearchFilter from '../State/Meal/Filters/MealSearchFilter';
import { MealTime } from '../State/Meal/Filters/MealTime';
import CeraonDispatcher from '../Store/CeraonDispatcher';
import * as Actions from '../Actions/Index';
import LoadingSpinner from '../Components/LoadingSpinner';
import Meal from '../State/Meal/Meal';
import Tag from '../State/Meal/Tag';
import MealCard, { MealCardMode } from '../Components/MealCard';

export interface SearchPageProps extends SearchPageState, React.Props<SearchPage> {

}

interface SearchPageInternalState {
  searchValue: string;
  tagsFilter: Tag;
}

export default class SearchPage extends React.Component<SearchPageProps, SearchPageInternalState> {
  constructor() {
    super();
    this.onMealTimeClicked = this.onMealTimeClicked.bind(this);

    this.onSearchTextInput = this.onSearchTextInput.bind(this);
    this.onSearchTextEnter = this.onSearchTextEnter.bind(this);
    this.onTagFilterChange = this.onTagFilterChange .bind(this);

    this.removeTextFilter = this.removeTextFilter.bind(this);

    this.viewMeal = this.viewMeal.bind(this);
    CeraonDispatcher(Actions.createFetchTagsAction());

    this.state = {searchValue: '', tagsFilter: {id: null, title: null, alias: null}};
  }

  viewMeal(id: string) {
    CeraonDispatcher(Actions.createViewMealAction(id));
  }

  removeTextFilter(filter: string) {
    let newFilters = Object.assign({}, this.props.filters);
    let index = newFilters.textFilter.findIndex((txtFilter) => {
      return txtFilter == filter;
    });

    if (index > -1) {
      newFilters.textFilter.splice(index, 1);
    }

    CeraonDispatcher(Actions.createMealSearchAction(newFilters));
  }

  onSearchTextEnter(event: any) {
    let searchValue = this.state.searchValue;
    if (searchValue.length > 0 && event.keyCode === 13) {
      this.setState({searchValue: ''});
      let newFilters = Object.assign({}, this.props.filters);
      newFilters.textFilter.push(searchValue);

      CeraonDispatcher(Actions.createMealSearchAction(newFilters));
    }
  }

  onSearchTextInput(event: any) {
    let searchValue = event.target.value;
    this.setState({searchValue: searchValue});
  }

  onTagFilterChange(tag: Tag) {
    this.setState({tagsFilter: tag});
    let newFilters = Object.assign({}, this.props.filters);
    if(tag.id === null) {
      newFilters.tagsFilter = [];
    } else {
      newFilters.tagsFilter = [tag];
    }
    CeraonDispatcher(Actions.createMealSearchAction(newFilters));
  }

  onMealTimeClicked(event: any, data: any) {
    let newFilters = Object.assign({}, this.props.filters);
    newFilters.mealTime = data.value as MealTime;
    CeraonDispatcher(Actions.createMealSearchAction(newFilters));
  }

  render() {
    let textFilters = [];

    let i = 0;
    for (let filter of this.props.filters.textFilter) {
      textFilters.push((
        <Menu.Item key={i++}>
          <a onClick={()=>this.removeTextFilter(filter)}><Icon name='remove'/></a>
          {filter}
        </Menu.Item>
      ));
    }

    let resultCards = [];

    for (let result of this.props.results) {
      resultCards.push(
        <MealCard key={result.id}
          meal={result}
          mealCardMode={MealCardMode.Full}
          onClick={(result: Meal)=>{ this.viewMeal(result.id)}
          }/>
      );
    }

    return (
      <div className='ui stackable grid'>
        <div className='column search-page-filters'>
          <div className='ui menu vertical stackable left'>
            <Menu.Item>
              <div className="ui input">
                <input
                  className='prompt'
                  type='text'
                  placeholder='Filter by name'
                  value={this.state.searchValue}
                  onChange={this.onSearchTextInput}
                  onKeyUp={this.onSearchTextEnter}/>
              </div>
              {textFilters}
            </Menu.Item>
            <Menu.Item>
              <Menu.Header>Meal Time</Menu.Header>
              <Menu.Item>
                <Checkbox radio name='mealTime'
                  label='Breakfast'
                  onChange={this.onMealTimeClicked}
                  checked={this.props.filters.mealTime == MealTime.Breakfast}
                  value={MealTime.Breakfast}/>
              </Menu.Item>
              <Menu.Item>
                <Checkbox radio name='mealTime'
                  label='Lunch'
                  onChange={this.onMealTimeClicked}
                  checked={this.props.filters.mealTime == MealTime.Lunch}
                  value={MealTime.Lunch}/>
              </Menu.Item>
              <Menu.Item>
                <Checkbox radio name='mealTime'
                  label='Dinner'
                  onChange={this.onMealTimeClicked}
                  checked={this.props.filters.mealTime == MealTime.Dinner}
                  value={MealTime.Dinner}/>
              </Menu.Item>
              <Menu.Item>
                <Checkbox radio name='mealTime'
                  label='Any Time'
                  onChange={this.onMealTimeClicked}
                  checked={this.props.filters.mealTime == MealTime.Any}
                  value={MealTime.Any}/>
              </Menu.Item>
            </Menu.Item>
            <Menu.Item>
              <Menu.Header>Food Type</Menu.Header>
              <SelectRP
                multi={false}
                valueKey='id'
                labelKey='title'
                options={this.props.mealTags}
                onChange={this.onTagFilterChange}
                label={this.state.tagsFilter.title}
                value={this.state.tagsFilter.id}
                resetValue={{id: null, title: 'Select a type', alias: null}}
                />
            </Menu.Item>
          </div>
        </div>
        <div className='column search-results-wrapper'>
          {this.props.isLoading ?
            <LoadingSpinner loadingStatusMessage={'Searching through thousands of meals..'}/>
            : resultCards
          }
        </div>
      </div>
    )
  }
}
