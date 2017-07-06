# -*- coding: utf-8 -*-
"""Public section, including homepage and signup."""
from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required, login_user, logout_user

from ceraon.extensions import login_manager
from ceraon.public.forms import LoginForm
from ceraon.user.forms import RegisterForm
from ceraon.user.models import User
from ceraon.utils import flash_errors

blueprint = Blueprint('public', __name__, static_folder='../static')


@login_manager.user_loader
def load_user(user_id):
    """Load user by ID."""
    user = User.get_by_id(int(user_id))
    return user


@blueprint.route('/', methods=['GET', 'POST'])
def home():
    """Home page."""
    form = LoginForm(request.form)
    # Handle logging in
    if request.method == 'POST':
        if form.validate_on_submit():
            login_user(form.user)
            flash('You are logged in.', 'success')
            redirect_url = request.args.get('next') or url_for('user.me')
            return redirect(redirect_url)
        else:
            flash_errors(form)
    return render_template('public/home.html', form=form)


@blueprint.route('/login', methods=['GET', 'POST'], strict_slashes=False)
def login():
    """Login."""
    form = LoginForm(request.form)
    if current_user.is_authenticated:
        redirect_url = request.args.get('next') or url_for('user.me')
        return redirect(redirect_url)
    # Handle logging in
    if request.method == 'POST':
        if form.validate_on_submit():
            login_user(form.user)
            flash('You are logged in.', 'success')
            redirect_url = request.args.get('next') or url_for(
                'user.me', embed_class='user', embed_id=form.user.id)
            return redirect(redirect_url)
        else:
            flash_errors(form)
    return render_template('public/login.html', form=form)


@blueprint.route('/logout/')
@login_required
def logout():
    """Logout."""
    logout_user()
    flash('You are logged out.', 'info')
    return redirect(url_for('public.home'))


@blueprint.route('/register/', methods=['GET', 'POST'], strict_slashes=False)
def register():
    """Register new user."""
    form = RegisterForm(request.form)
    if current_user.is_authenticated:
        redirect_url = request.args.get('next') or url_for('user.me')
        return redirect(redirect_url)
    if form.validate_on_submit():
        user = User.create(email=form.email.data, password=form.password.data,
                           first_name=form.first_name.data, active=True,
                           last_name=form.last_name.data)
        login_user(user)
        flash('You are logged in.', 'success')
        redirect_url = request.args.get('next') or url_for(
            'user.me', embed_class='user', embed_id=user.id)
        return redirect(redirect_url)
    else:
        flash_errors(form)
    return render_template('public/register.html', form=form)


@blueprint.route('/about/')
def about():
    """About page."""
    form = LoginForm(request.form)
    return render_template('public/about.html', form=form)


@blueprint.route('/v2/')
def v2():
    return render_template('AppHost.html')
