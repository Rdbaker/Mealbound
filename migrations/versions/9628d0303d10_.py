"""Adds the meal table and the location_meal join table

Revision ID: 9628d0303d10
Revises: dc30e7bcdd08
Create Date: 2017-05-23 21:04:53.966486

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '9628d0303d10'
down_revision = 'dc30e7bcdd08'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        'meal',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('scheduled_for', sa.DateTime(), nullable=False),
        sa.Column('location_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('price', sa.Float(), nullable=False),
        sa.ForeignKeyConstraint(['location_id'], ['location.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table(
        'location_meal',
        sa.Column('location_guid',
                  postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('meal_guid', postgresql.UUID(as_uuid=True), nullable=False),
        sa.ForeignKeyConstraint(['location_guid'], ['location.id'], ),
        sa.ForeignKeyConstraint(['meal_guid'], ['meal.id'], ),
        sa.PrimaryKeyConstraint('location_guid', 'meal_guid')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('location_meal')
    op.drop_table('meal')
    # ### end Alembic commands ###
