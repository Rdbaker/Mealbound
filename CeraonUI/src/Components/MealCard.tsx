import * as React from 'react';
import { Card, Label, Rating } from 'semantic-ui-react';
import Meal from '../State/Meal/Meal';

interface MealCardProps extends React.Props<MealCard> {
  meal: Meal;
}

export default class MealCard extends React.Component<MealCardProps, any> {
  constructor() {
    super();
  }

  render() {
    return (
      <Card.Group>
        <Card fluid>
          <Card.Content>
            <Card.Header>{this.props.meal.name} <Label tag>${this.props.meal.price}</Label></Card.Header>
            <Card.Meta>{this.props.meal.location.name}</Card.Meta>
            <Card.Description>{this.props.meal.description}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Rating icon='star' rating={this.props.meal.location.rating} maxRating={5} disabled/>
          </Card.Content>
        </Card>
      </Card.Group>
    )
  }
}
