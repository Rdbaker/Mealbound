import * as React from 'react';
import {MealTime, MealTimeToString} from '../State/Meal/Filters/MealTime';
import { Button, Dropdown } from 'semantic-ui-react';

interface MealSearchDropdownProps extends React.Props<MealSearchDropdown> {
  mealTimeOptions: MealTime[];
  onSearchClicked: (selectedMealTime: MealTime) => void;
  showSubmitButton?: boolean;
}

interface MealSearchDropdownState {
  selectedMealTime: MealTime;
}

export default class MealSearchDropdown extends React.Component<MealSearchDropdownProps, MealSearchDropdownState> {
  constructor() {
    super();
    this.state = {selectedMealTime: MealTime.Any};
    this.onSubmit = this.onSubmit.bind(this);
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
  }

  getDropdownOptions() : object[] {
    return this.props.mealTimeOptions.map((option: MealTime) => {
      return { text: MealTimeToString(option), value: option }
    });
  }

  onSelectionChanged(event: any) {
    let mealTime = event.target.value;
    this.setState({selectedMealTime: mealTime});

    if (!this.props.showSubmitButton) {
      this.props.onSearchClicked(mealTime);
    }
  }

  onSubmit() {
    this.props.onSearchClicked(this.state.selectedMealTime);
  }

  render() {
    let submitButton = <div/>

    if (this.props.showSubmitButton) {
      submitButton = <Button primary onClick={this.onSubmit}>Go</Button>
    }

    return (
      <span>
      {' '}
      <Dropdown inline options={this.getDropdownOptions()} defaultValue={this.props.mealTimeOptions[0]} onChange={this.onSelectionChanged}/>
      {' '}
      {submitButton}
      </span>
    )
  }
}
