"""empty message

Revision ID: 230cd53af17d
Revises: 20d2b40a57d9
Create Date: 2017-05-29 11:09:12.653161

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '230cd53af17d'
down_revision = '20d2b40a57d9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('meal', sa.Column('description', sa.String(length=255), nullable=False))
    op.add_column('meal', sa.Column('name', sa.String(length=255), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('meal', 'name')
    op.drop_column('meal', 'description')
    # ### end Alembic commands ###
