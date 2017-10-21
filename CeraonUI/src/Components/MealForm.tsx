import * as React from 'react';
import * as SelectRP from 'react-select-plus';
import { Segment, Header, Button } from 'semantic-ui-react';
import Meal from '../State/Meal/Meal';
import Tag from '../State/Meal/Tag';
import UrlProvider from '../Services/UrlProvider';
import * as DateTimePicker from 'react-datetime';
import CurrencyInput from 'react-number-input';
import * as  Moment from 'moment';
import * as Actions from '../Actions/Index';
import CeraonDispatcher from '../Store/CeraonDispatcher';

interface MealFormProps extends React.Props<MealForm> {
  meal?: Meal;
  headerText: string;
  submitText: string;
  onSubmit?: (title: string, descr: string, time: string, price: number, maxGuests: number, mealTags: Tag[]) => void;
  mealTagOptions: Tag[];
}

interface MealFormState {
  mealTitle: string;
  mealDescription: string;
  mealTime: any;
  price: number;
  maxGuests: number;
  isSubmitEnabled: boolean;
  datePickerFocused: boolean;
  mealTags: Tag[];
}

export default class MealForm extends React.Component<MealFormProps, MealFormState> {
  constructor(props: MealFormProps) {
    super(props);

    CeraonDispatcher(Actions.createFetchTagsAction());
    let state : MealFormState = {
        mealTitle: '',
        mealDescription: '',
        mealTime: Moment(),
        price: 0.00,
        isSubmitEnabled: false,
        datePickerFocused: false,
        maxGuests: undefined,
        mealTags: [],
    }

    if (this.props.meal) {
      state = {
        mealTitle: this.props.meal.name,
        mealDescription: this.props.meal.description,
        mealTime: Moment(this.props.meal.scheduled_for),
        price: this.props.meal.price,
        maxGuests: this.props.meal.max_guests || undefined,
        isSubmitEnabled: false,
        datePickerFocused: false,
        mealTags: this.props.meal.tags,
      }
    }

    state.isSubmitEnabled = MealForm.isSubmitEnabled(state.mealTitle, state.mealDescription, state.mealTime, state.price, state.maxGuests);
    this.state = state;
    this.onDescriptionChanged = this.onDescriptionChanged.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onMaxGuestsChange = this.onMaxGuestsChange.bind(this);
    this.onTagChange = this.onTagChange.bind(this);
  }

  private onSubmitForm() {
    if (this.props.onSubmit) {
      this.props.onSubmit(
        this.state.mealTitle,
        this.state.mealDescription,
        this.state.mealTime.format(),
        this.state.price,
        this.state.maxGuests,
        this.state.mealTags,
      );
    }
  }

  private static isSubmitEnabled(title: string, description: string, time: Moment.Moment, price: number, maxGuests: number) {
    return time.isAfter(Moment.now()) &&
        title.length > 0 &&
        description.length > 0 &&
        (maxGuests === undefined || (typeof(maxGuests) === "number" && maxGuests > 0)) &&
        price > 0;
  }

  private onTagChange(tags) {
    if(!Array.isArray(tags)) {
      tags = [tags];
    }
    this.setState({
      mealTags: tags
    })
  }

  private updateIsSubmitEnabled(title: string, description: string, time: any, price: number, maxGuests: number) {
    this.setState({
      isSubmitEnabled: MealForm.isSubmitEnabled(title, description, time, price, maxGuests),
    });
  }

  private onTitleChange(event) {
    let titleValue = event.target.value;
    this.setState({mealTitle: titleValue});

    this.updateIsSubmitEnabled(titleValue, this.state.mealDescription, this.state.mealTime, this.state.price, this.state.maxGuests);
  }

  private onMaxGuestsChange(evt) {
    let maxGuestValue = evt.target.value;
    let castedNum = Number(maxGuestValue);
    let finalVal;
    if (!isNaN(castedNum)) {
      finalVal = castedNum;
      this.setState({maxGuests: castedNum});
    } else {
      finalVal = maxGuestValue;
      this.setState({maxGuests: maxGuestValue});
    }

    this.updateIsSubmitEnabled(this.state.mealTitle, this.state.mealDescription, this.state.mealTime, this.state.price, finalVal);
  }

  private onDescriptionChanged(event) {
    let value = event.target.value;
    this.setState({mealDescription: value});

    this.updateIsSubmitEnabled(this.state.mealTitle, this.state.mealDescription, this.state.mealTime, this.state.price, this.state.maxGuests);
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
                  this.updateIsSubmitEnabled(this.state.mealTitle, this.state.mealDescription, moment, this.state.price, this.state.maxGuests);
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
                  this.updateIsSubmitEnabled(this.state.mealTitle, this.state.mealDescription, this.state.mealTime, price, this.state.maxGuests);
                }}/>
            </div>
            <div className='field'>
              <label>Max Guests</label>
              <input type='text'
                    placeholder='maximum buyers'
                    name='max-buyers'
                    value={this.state.maxGuests}
                    onChange={this.onMaxGuestsChange}/>
            </div>
            <div className='field'>
              <label>Cuisine Type</label>
              <SelectRP
                multi={true}
                valueKey='id'
                labelKey='title'
                options={this.props.mealTagOptions}
                onChange={this.onTagChange}
                label={this.state.mealTags.map(tag => tag.title)}
                value={this.state.mealTags.map(tag => tag.id)}
                resetValue={{id: null, title: 'Select a type', alias: null}}
                />
            </div>
            <Button onClick={this.onSubmitForm} disabled={!this.state.isSubmitEnabled}>{this.props.submitText}</Button>
          </div>
        </Segment>
    )
  }
}
