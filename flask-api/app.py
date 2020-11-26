from flask import Flask, request, make_response, jsonify
from flask_pymongo import PyMongo
import bcrypt
from datetime import datetime, timezone, timedelta
import secrets

app = Flask(__name__)
app.config.from_object('config')
mongo = PyMongo(app)

@app.route('/')
def index():
    return make_response(jsonify({'test': 'test worked!'}), 200)

@app.route('/meeting', methods=['GET', 'POST'])
def meeting():
    if request.method == 'POST':
        # logging new meeting info
        # get info from post
        # save to mongodb
        return True
    else:
        # getting meeting info from db
        # get id from get data
        # return info
        return False

@app.route('/upload', methods=['POST'])
def upload():
    # get audio file
    # transcribe
    # call BERT model
    return True 

@app.route('/users', methods=['GET'])
def users():
    names = []
    for user in mongo.db.users.find()[0:50]:
        names.append(str(user['name']))
    return make_response(jsonify(names), 200)

@app.route('/sessions', methods=['GET'])
def sessions():
    sessions = []
    for session in mongo.db.sessions.find()[0:50]:
        sessions.append((session['user_id'], session['expire_time']))
    return make_response(jsonify(sessions), 200)

@app.route('/signup', methods=['POST'])
def signup():
    post_data = request.json
    name = post_data.get('name')
    email = post_data.get('email')
    password = post_data.get('password')
    user = mongo.db.users.find_one({'email': email})
    if user is None:
        hashpass = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
        user = {
            'name': name,
            'email': email,
            'password': hashpass,
            "date": datetime.now(timezone.utc)
        }
        user_id = mongo.db.users.insert_one(user).inserted_id
        token = login_user(user_id)
        return make_response(jsonify({'status': 'success', 'token': token}), 200)
    return make_response(jsonify({'status': 'failed'}), 200)

@app.route('/login', methods=['POST'])
def login():
    post_data = request.json
    email = post_data.get('email')
    password = post_data.get('password')
    user = mongo.db.users.find_one({'email': email})
    if user:
        valid = bcrypt.checkpw(password.encode(), user['password'])
        if valid:
            session = mongo.db.sessions.find_one({'user_id': str(user['_id'])})
            if not session:
                token = login_user(user['_id'])
                return make_response(jsonify({'status': 'success', 'token': token}), 200)
    return make_response(jsonify({'status': 'failed'}), 200)

@app.route('/logout', methods=['POST'])
def logout():
    post_data = request.json
    email = post_data.get('email')
    token = post_data.get('token')
    print(email)
    user = mongo.db.users.find_one({'email': email})
    if user:
        user_id = user['_id']
        if authenticate(user_id, token):
            logout_user(user_id)
            return make_response(jsonify({'status': 'success'}), 200)
    return make_response(jsonify({'status': 'failed'}), 200)

def login_user(user_id):
    current_time = datetime.now(timezone.utc)
    token = secrets.token_hex(16)
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=app.config['DEBUG'])
