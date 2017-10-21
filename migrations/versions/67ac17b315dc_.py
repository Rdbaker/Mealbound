"""Adds the meal.num_reviews and meal.avg_rating columns

Revision ID: 67ac17b315dc
Revises: e63d9d5e76a9
Create Date: 2017-09-06 07:18:22.318531

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '67ac17b315dc'
down_revision = 'e63d9d5e76a9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('meal', sa.Column('avg_rating', sa.Float(), nullable=True))
    op.add_column('meal', sa.Column('num_reviews', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('meal', 'num_reviews')
    op.drop_column('meal', 'avg_rating')
    # ### end Alembic commands ###