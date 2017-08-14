import * as React from 'react';
import {MealTime} from '../State/Meal/Filters/MealTime';
import { Button, Dropdown } from 'semantic-ui-react';

interface MealSearchDropdownProps extends React.Props<MealSearchDropdown> {
  onSearchClicked: (selectedMealTime: MealTime) => void;
  dropdownHeader: string;
}

export default class MealSearchDropdown extends React.Component<MealSearchDropdownProps, undefined> {
  private _dropdown: HTMLDivElement;
  constructor() {
    super();
    this.onBreakfast = this.onBreakfast.bind(this);
    this.onLunch = this.onLunch.bind(this);
    this.onDinner = this.onDinner.bind(this);

  }

  onBreakfast() {
    this.props.onSearchClicked(MealTime.Breakfast);
  }

  onLunch() {
    this.props.onSearchClicked(MealTime.Lunch);
  }

  onDinner() {
    this.props.onSearchClicked(MealTime.Dinner);
  }

  render() {
    return (
      <span>
      {' '}
      <Dropdown inline text={this.props.dropdownHeader}>
        <Dropdown.Menu>
          <Dropdown.Item text='Breakfast' onClick={this.onBreakfast}/>
          <Dropdown.Item text='Lunch' onClick={this.onLunch}/>
          <Dropdown.Item text='Dinner' onClick={this.onDinner}/>
        </Dropdown.Menu>
      </Dropdown>
      {' '}
      </span>
    )
  }
}
