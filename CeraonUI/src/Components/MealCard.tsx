import * as React from 'react';
import * as  Moment from 'moment';
import { Button, Card, Label, Rating } from 'semantic-ui-react';
import Meal from '../State/Meal/Meal';
import UrlProvider from '../Services/UrlProvider';
import CeraonDispatcher from '../Store/CeraonDispatcher';
import * as Actions from '../Actions/Index';
import Review from '../State/Meal/Review';

export enum MealCardMode {
  Summary,
  Full
}

interface MealCardProps extends React.Props<MealCard> {
  meal: Meal;
  mealCardMode: MealCardMode;
  onClick?: (meal: Meal) => void;
  isGuest?: boolean;
  isReviewCreatePending?: boolean;
  isReviewCreateSuccess?: boolean;
}

export default class MealCard extends React.Component<MealCardProps, any> {
  constructor(props: MealCardProps) {
    super(props);
    this.state = {
      reviewDescription: this.getReviewDescription(),
    };
    this.onRatingChange = this.onRatingChange.bind(this);
    this.onCancelReviewForm = this.onCancelReviewForm.bind(this);
    this.onSubmitReviewForm = this.onSubmitReviewForm.bind(this);
    this.onReviewDescriptionChange = this.onReviewDescriptionChange.bind(this);
  }

  private getReviewDescription() {
    if (this.props.my_review) {
      return this.props.my_review.description;
    } else {
      return null;
    }
  }

  private renderLocation() {
    if (this.props.mealCardMode == MealCardMode.Full && this.props.meal.location) {
      return (<Card.Meta>{this.props.meal.location.address}</Card.Meta>);
    } else {
      return null;
    }
  }

  private renderScheduledFor() {
    if (this.props.mealCardMode == MealCardMode.Full) {
      return (<Card.Meta>{Moment(this.props.meal.scheduled_for).format('ddd, MMM Do [at] h:mm a')}</Card.Meta>);
    } else {
      return (<Card.Meta>{Moment(this.props.meal.scheduled_for).fromNow()}</Card.Meta>);
    }
  }

  private onRatingChange(evt, data) {
    this.setState({
      pendingReviewRating: data.rating,
      showReviewForm: true,
      reviewSubmitEnabled: false
    });
  }

  private onCancelReviewForm() {
    this.setState({
      showReviewForm: false
    });
  }

  private onSubmitReviewForm() {
    let review : Partial<Review> = {
      rating: this.state.pendingReviewRating,
      description: this.state.reviewDescription,
      meal: this.props.meal
    }
    CeraonDispatcher(Actions.createCreateReviewAction(review));
  }

  private onReviewDescriptionChange(evt) {
    let reviewDesc = evt.target.value;
    let submitEnabled = reviewDesc.length > 5 && reviewDesc.length < 1000; // arbitrary
    this.setState({
      reviewDescription: reviewDesc,
      reviewSubmitEnabled: submitEnabled
    });
  }

  private getMealRating() {
    // TODO: get & return aggregate rating
    if (this.state.pendingReviewRating) {
      return this.state.pendingReviewRating;
    }

    if (this.props.meal.my_review) {
      return this.props.meal.my_review.rating;
    } else {
      return null;
    }
  }

  private renderRating() {
    if (Moment(this.props.meal.scheduled_for).isAfter()) {
      // meal has not yet happened, return disabled rating
      return (<Rating icon='star' rating={this.getMealRating()} maxRating={5} disabled/>);
    } else {
      if (this.props.meal.joined) {
        // TODO: this should display the avg aggregate rating if the user has already reviewed the meal
        return (<Rating icon='star' rating={this.getMealRating()} maxRating={5} onRate={this.onRatingChange} />);
      } else {
        return (<Rating icon='star' rating={this.getMealRating()} maxRating={5} disabled/>);
      }
    }
  }

  private getFormHiddenState() {
    if (!this.state.showReviewForm) {
      return 'hidden';
    } else {
      return '';
    }
  }

  renderReviewForm() {
    return (
      <div className={`ui form ${this.getFormHiddenState()}`}>
        <div className="field">
          <label>Review</label>
          <input type='text'
            placeholder='meal review'
            name='review-description'
            value={this.state.reviewDescription}
            onChange={this.onReviewDescriptionChange}/>
        </div>
        <div className="field">
          <Button onClick={this.onCancelReviewForm}>Cancel</Button>
          <Button color="green"
            onClick={this.onSubmitReviewForm}
            loading={this.props.isReviewCreatePending}
            disabled={!this.state.reviewSubmitEnabled || this.props.isReviewCreatePending}
          >
            Submit
          </Button>
          { this.props.isReviewCreateSuccess ?
            <span><i className="icon checkmark"></i>Review Saved!</span>
            :
            null
          }
        </div>
      </div>
    )
  }

  render() {
    let card = (
      <Card.Group>
        <Card fluid>
          <Card.Content>
            <Card.Header>{this.props.meal.name} <Label tag>${this.props.meal.price}</Label></Card.Header>
            <Card.Meta>{this.props.meal.host.public_name}</Card.Meta>
            {this.renderScheduledFor()}
            {this.renderLocation()}
            <Card.Description>{this.props.meal.description}</Card.Description>
          </Card.Content>
          <Card.Content extra className="ui vertical accordion menu">
            {this.renderRating()}
            {this.renderReviewForm()}
          </Card.Content>
        </Card>
      </Card.Group>
    )

    if (this.props.onClick) {
      card = (<a href={UrlProvider.getViewMealUrl(this.props.meal.id)} onClick={(event) => { event.preventDefault(); this.props.onClick(this.props.meal)}}>
        {card}
        </a>);
    }

    let className = '';

    if (this.props.mealCardMode == MealCardMode.Summary) {
      className='meal-card-summary';
    }

    return (
      <div className={className}>
      {card}
      </div>
    )
  }
}
