import * as React from 'react';
import { Segment, Header, Button } from 'semantic-ui-react';
import Meal from '../State/Meal/Meal';
import UrlProvider from '../Services/UrlProvider';
import * as DateTimePicker from 'react-datetime';
import CurrencyInput from 'react-number-input';
import * as  Moment from 'moment';

interface MealFormProps extends React.Props<MealForm> {
  meal?: Meal;
  headerText: string;
  submitText: string;
  onSubmit?: (title: string, descr: string, time: string, price: number) => void;
}

interface MealFormState {
  mealTitle: string;
  mealDescription: string;
  mealTime: Moment.Moment;
  price: number;
  isSubmitEnabled: boolean;
  datePickerFocused: boolean;
}

export default class MealForm extends React.Component<MealFormProps, MealFormState> {
  constructor(props: MealFormProps) {
    super(props);

    let state : MealFormState = {
        mealTitle: '',
        mealDescription: '',
        mealTime: Moment(),
        price: 0.00,
        isSubmitEnabled: false,
        datePickerFocused: false,
    }

    if (this.props.meal) {
      state = { 
        mealTitle: this.props.meal.name,
        mealDescription: this.props.meal.description,
        mealTime: Moment(this.props.meal.scheduled_for),
        price: this.props.meal.price,
        isSubmitEnabled: false,
        datePickerFocused: false,
      }
    }

    state.isSubmitEnabled = MealForm.isSubmitEnabled(state.mealTitle, state.mealDescription, state.mealTime, state.price);
    this.state = state;
    this.onDescriptionChanged = this.onDescriptionChanged.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
  }

  private onSubmitForm() {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.mealTitle, this.state.mealDescription, this.state.mealTime.format(), this.state.price);
    }
  }

  private static isSubmitEnabled(title: string, description: string, time: Moment.Moment, price: number) {
    return time.isAfter(Moment.now()) &&
        title.length > 0 &&
        description.length > 0 &&
        price > 0;
  }

  private updateIsSubmitEnabled(title: string, description: string, time: Moment.Moment, price: number) {
    this.setState({
      isSubmitEnabled: MealForm.isSubmitEnabled(title, description, time, price),
    });
  }

  private onTitleChange(event) {
    let titleValue = event.target.value;
    this.setState({mealTitle: titleValue});

    this.updateIsSubmitEnabled(titleValue, this.state.mealDescription, this.state.mealTime, this.state.price);
  }

  private onDescriptionChanged(event) {
    let value = event.target.value;
    this.setState({mealDescription: value});

    this.updateIsSubmitEnabled(this.state.mealDescription, value, this.state.mealTime, this.state.price);
  }

  render() {
    return (
        <Segment>
          <Header size='large' content={this.props.headerText} />
          <div className='ui form'>
            <div className='field'>
              <label>Meal Title*</label>
              <input type='text'
                    placeholder='Meal Title'
                    name='meal-title'
                    value={this.state.mealTitle}
                    onChange={this.onTitleChange}/>
            </div>
            <div className='field'>
              <label>Meal Description*</label>
              <input type='text'
                    placeholder='Meal Description'
                    name='meal-description'
                    value={this.state.mealDescription}
                    onChange={this.onDescriptionChanged}/>
            </div>
            <div className='field'>
              <label>Meal Time*</label>
              <DateTimePicker
                isValidDate={moment => moment.isAfter(Moment.now())}
                value={this.state.mealTime.toDate()}
                onChange={moment => {
                  this.setState({mealTime: moment});
                  this.updateIsSubmitEnabled(this.state.mealTitle, this.state.mealDescription, moment, this.state.price);
                ;}}/>
            </div>
            <div className='field'>
              <label>Meal Price*</label>
              <CurrencyInput value={this.state.price}
                placeholder='Meal Price'
                format='$0,0.00'
                min={0}
                max={50}
                onChange={(price) => {
                  this.setState({price: price});
                  this.updateIsSubmitEnabled(this.state.mealTitle, this.state.mealDescription, this.state.mealTime, price);
                }}/>
            </div>
            <Button onClick={this.onSubmitForm} disabled={!this.state.isSubmitEnabled}>{this.props.submitText}</Button>
          </div>
        </Segment>
    )
  }
}
