from datetime import datetime, timezone, timedelta
import secrets
from flask import Blueprint, render_template, request, make_response, jsonify
from pajamas.extensions import bcrypt
from pajamas.extensions import mongo


bp = Blueprint('users_bp', __name__)


@bp.route('/', methods=['GET'])
def get_users():
    names = []
    for user in mongo.db.users.find()[0:50]:
        names.append(str(user['name']))
    return make_response(jsonify(names), 200)


@bp.route('/sessions', methods=['GET'])
def get_sessions():
    sessions = []
    for session in mongo.db.sessions.find()[0:50]:
        sessions.append((session['user_id'], session['expire_time']))
    return make_response(jsonify(sessions), 200)


@bp.route('/signup', methods=['POST'])
def signup():
    post_data = request.json
    name = post_data.get('name')
    email = post_data.get('email')
    password = post_data.get('password')
    user = mongo.db.users.find_one({'email': email})
    if user is None:
        hashpass = bcrypt.generate_password_hash(password).decode('utf-8')
        user = {
            'name': name,
            'email': email,
            'password': hashpass,
            "date": datetime.now(timezone.utc)
        }
        user_id = mongo.db.users.insert_one(user).inserted_id
        token = login_user(user_id)
        return make_response(jsonify({'status': 'success', 'token': token, 'user_id': str(user_id), 'user_name': name}), 200)
    return make_response(jsonify({'status': 'failed'}), 500)


@bp.route('/login', methods=['POST'])
def login():
    post_data = request.json
    email = post_data.get('email')
    password = post_data.get('password')
    user = mongo.db.users.find_one({'email': email})
    if user:
        valid = bcrypt.check_password_hash(user['password'], password)
        if valid:
            session = mongo.db.sessions.find_one({'user_id': str(user['_id'])})
            token = ''
            if not session:
                token = login_user(user['_id'])
            else:
                token = session['token']
            return make_response(jsonify({'status': 'success', 'token': token, 'user_id': str(user['_id']), 'user_name': str(user['name'])}), 200)
    return make_response(jsonify({'status': 'failed'}), 500)


@bp.route('/logout', methods=['POST'])
def logout():
    post_data = request.json
    email = post_data.get('email')
    token = post_data.get('token')
    user = mongo.db.users.find_one({'email': email})
    if user:
        user_id = user['_id']
        if authenticate(user_id, token):
            logout_user(user_id)
            return make_response(jsonify({'status': 'success'}), 200)
    return make_response(jsonify({'status': 'failed'}), 500)


def login_user(user_id):
    current_time = datetime.now(timezone.utc)
    token = secrets.token_urlsafe()
    session = mongo.db.sessions.find_one({'user_id': str(user_id)})
    session = {
        'user_id': str(user_id),
        'token': token,
        'expire_time': current_time + timedelta(days=7)
    }
    mongo.db.sessions.insert_one(session)
    return token


def logout_user(user_id):
    mongo.db.sessions.delete_one({'user_id': str(user_id)})


def authenticate(user_id, token):
    session = mongo.db.sessions.find_one({'user_id': str(user_id)})
    if session:
        if datetime.now(timezone.utc).replace(tzinfo=None) > session['expire_time']:
            logout_user(user_id)
            return False
        return session['token'] == token
    return False
