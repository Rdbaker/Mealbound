"""Removes the `users.username` column and adds the `users.facebook_id` column.

Revision ID: ddd00fbe2758
Revises: b5c16f116e54
Create Date: 2017-06-19 21:49:45.269126

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ddd00fbe2758'
down_revision = 'b5c16f116e54'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('facebook_id', sa.String(length=80), nullable=True))
    op.create_index(op.f('ix_users_facebook_id'), 'users', ['facebook_id'], unique=True)
    op.drop_constraint('users_username_key', 'users', type_='unique')
    op.drop_column('users', 'username')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('username', sa.VARCHAR(length=80), autoincrement=False, nullable=False))
    op.create_unique_constraint('users_username_key', 'users', ['username'])
    op.drop_index(op.f('ix_users_facebook_id'), table_name='users')
    op.drop_column('users', 'facebook_id')
    # ### end Alembic commands ###
