"""Update create table

Revision ID: 90639da4ca0c
Revises: 53cab95c0642
Create Date: 2025-04-16 14:00:01.293321

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '90639da4ca0c'
down_revision: Union[str, None] = '53cab95c0642'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'position')
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('position', sa.VARCHAR(), autoincrement=False, nullable=False))
    # ### end Alembic commands ###
