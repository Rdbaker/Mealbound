"""Add the meal.max_guests column

Revision ID: 7c5a1a92c81f
Revises: 67ac17b315dc
Create Date: 2017-09-10 15:55:47.568918

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7c5a1a92c81f'
down_revision = '67ac17b315dc'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('meal', sa.Column('max_guests', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('meal', 'max_guests')
    # ### end Alembic commands ###
