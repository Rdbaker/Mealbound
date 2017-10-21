import * as React from 'react';

import CeraonDispatcher from '../Store/CeraonDispatcher';
import * as Actions from '../Actions/Index';
import EditMealPageState from '../State/Pages/EditMealPageState';
import MealForm from '../Components/MealForm';
import Tag from '../State/Meal/Tag';
import LoadingSpinner from '../Components/LoadingSpinner';
import ErrorModal from '../Components/ErrorModal';

export default class EditMealPage extends React.Component<EditMealPageState, undefined> {
  constructor(props: EditMealPageState) {
    super(props);
    this.onMealEdited = this.onMealEdited.bind(this);
  }

  private onMealEdited(title: string, descr: string, time: string, price: number, maxGuests: number, mealTags: Tag[]) {
    CeraonDispatcher(Actions.createUpdateMealAction({
      id: this.props.meal.id,
      name: title,
      description: descr,
      price: price,
      max_guests: maxGuests,
      scheduled_for: time,
      tags: mealTags,
    }));

    CeraonDispatcher(Actions.createViewMealAction(this.props.meal.id));
  }

  render() {
    let pageContent : JSX.Element;
    if (this.props.mealLoading) {
      pageContent = <LoadingSpinner loadingStatusMessage='Retrieving meal details..'/>;
    } else {
      if (this.props.failedToFindMeal || !this.props.meal) {
        return <ErrorModal errorIcon='question circle'
                errorMessageHeader="Sorry, this meal doesn't exist!"
                errorMessageSubheader="We couldn't find the meal you were looking for. The host may have cancelled it, or it may never have existed!"
                actionMessage='Head Home?'
                action={()=> CeraonDispatcher(Actions.createGoHomeAction())}
                />
      }

      pageContent = <MealForm meal={this.props.meal} headerText='Edit meal details' onSubmit={this.onMealEdited} submitText='Update Meal' mealTagOptions={[]}/>
    }

    return (
      <div className='ui stackable grid form-page'>
        <div className='column form'>
          { pageContent }
        </div>
      </div>);
  }
}
