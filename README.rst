===============================
Ceraon
===============================

Meal finder


Quickstart
----------

Before running shell commands, set the ``FLASK_APP`` and ``FLASK_DEBUG``
environment variables ::

    export FLASK_APP=/path/to/autoapp.py
    export FLASK_DEBUG=1

Alternatively, you can run the shell command included in this project ::

    . env.sh

Then run the following commands to bootstrap your environment ::

    git clone https://rdbaker@bitbucket.org/rdbaker/ceraon.git
    cd ceraon
    pip install -r requirements/dev.txt
    bower install
    flask run

You will see a pretty welcome screen.

Once you have installed PostgreSQL, run the following to create your app's
database tables and perform the initial migration ::

    . setup_db.sh
    flask db upgrade
    flask run


Deployment
----------

In your production environment, make sure the ``FLASK_DEBUG`` environment
variable is unset or is set to ``0``, so that ``ProdConfig`` is used.


Shell
-----

To open the interactive shell, run ::

    flask shell

By default, you will have access to the flask ``app``.


Running Tests
-------------

To run all tests, run ::

    flask test


Migrations
----------

Whenever a database migration needs to be made. Run the following commands ::

    flask db migrate

This will generate a new migration script. Then run ::

    flask db upgrade

To apply the migration.

For a full migration command reference, run ``flask db --help``.
