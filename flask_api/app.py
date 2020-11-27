from flask import Flask, request, make_response, jsonify
from flask_pymongo import PyMongo
from users.routes import users_bp
from meetings.routes import meetings_bp

app = Flask(__name__)
app.config.from_object('config')
app.register_blueprint(users_bp, url_prefix='/users')
app.register_blueprint(meetings_bp, url_prefix='/meetings')

mongo = PyMongo(app)

@app.route('/')
def index():
    return make_response(jsonify({'test': 'test worked!'}), 200) 

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=app.config['DEBUG'])
