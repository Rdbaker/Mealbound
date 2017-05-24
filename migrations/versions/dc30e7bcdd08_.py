"""Updates location.exact_price -> location.avg_price and adds location.address.

Revision ID: dc30e7bcdd08
Revises: 94f88d0bf9bb
Create Date: 2017-05-23 17:10:41.717223

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'dc30e7bcdd08'
down_revision = '94f88d0bf9bb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('location', sa.Column('address', sa.String(length=255), nullable=False))
    op.add_column('location', sa.Column('avg_price', sa.Float(), nullable=True))
    op.create_index(op.f('ix_location_avg_price'), 'location', ['avg_price'], unique=False)
    op.drop_index('ix_location_exact_price', table_name='location')
    op.drop_column('location', 'exact_price')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('location', sa.Column('exact_price', sa.INTEGER(), autoincrement=False, nullable=True))
    op.create_index('ix_location_exact_price', 'location', ['exact_price'], unique=False)
    op.drop_index(op.f('ix_location_avg_price'), table_name='location')
    op.drop_column('location', 'avg_price')
    op.drop_column('location', 'address')
    # ### end Alembic commands ###