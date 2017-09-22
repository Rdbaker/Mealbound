"""Models to handle businesses."""
import datetime as dt

from ceraon.database import (Column, SurrogatePK, Model, db, relationship)


class Tag(Model, SurrogatePK):
    """A tag associated with a business."""

    __tablename__ = 'tag'

    title = Column(db.String(255))
    alias = Column(db.String(255), index=True)
    created_at = Column(db.DateTime, nullable=False,
                        default=dt.datetime.utcnow)
    meal_tags = relationship('MealTag', cascade='delete')

    def __repr__(self):
        """Get the tag as a string."""
        return '<Tag({title} | {alias})>'.format(
            title=self.title.encode('ascii', 'ignore'),
            alias=self.alias.encode('ascii', 'ignore'))

    @classmethod
    def search(cls, query):
        """Search for a Tag by substring match of the title."""
        return cls.query.filter(cls.title.ilike('%{}%'.format(query)))


class MealTag(Model):
    """A join table for a Meal <-> Tag relation."""

    __tablename__ = 'meal_tag'

    meal_id = Column(db.ForeignKey('meal.id', ondelete='CASCADE'),
                     primary_key=True)
    meal = relationship('Meal')
    tag_id = Column(db.ForeignKey('tag.id', ondelete='CASCADE'),
                    primary_key=True)
    tag = relationship('Tag')
