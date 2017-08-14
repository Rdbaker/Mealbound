import * as React from 'react';
import { Card, Label, Rating } from 'semantic-ui-react';
import Meal from '../State/Meal/Meal';
import UrlProvider from '../Services/UrlProvider';

export enum MealCardMode {
  Summary,
  Full
}

interface MealCardProps extends React.Props<MealCard> {
  meal: Meal;
  mealCardMode: MealCardMode;
  onClick?: (meal: Meal) => void;
}

export default class MealCard extends React.Component<MealCardProps, any> {
  constructor() {
    super();
  }

  render() {
    let card = (
      <Card.Group>
        <Card fluid>
          <Card.Content>
            <Card.Header>{this.props.meal.name} <Label tag>${this.props.meal.price}</Label></Card.Header>
            <Card.Meta>{this.props.meal.host.public_name}</Card.Meta>
            <Card.Description>{this.props.meal.description}</Card.Description>
          </Card.Content>
          { this.props.meal.location ? 
            <Card.Content extra>
              <Rating icon='star' rating={this.props.meal.location.rating} maxRating={5} disabled/>
            </Card.Content>
            :
            <div/>
          }
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
