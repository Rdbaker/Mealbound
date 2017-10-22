"""Adds the tag.active column (and an index)

Revision ID: 56d323c5931a
Revises: b8382b9376b1
Create Date: 2017-10-22 18:45:20.685064

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '56d323c5931a'
down_revision = 'b8382b9376b1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('tag', sa.Column('active', sa.Boolean(), nullable=True))
    op.create_index(op.f('ix_tag_active'), 'tag', ['active'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_tag_active'), table_name='tag')
    op.drop_column('tag', 'active')
    # ### end Alembic commands ###
