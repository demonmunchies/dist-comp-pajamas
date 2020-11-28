from flask import Flask
from pajamas import users, meetings, audio
from pajamas.extensions import (
    bcrypt,
    mongo,
    socketio
)

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py')
    register_extensions(app)
    register_blueprints(app)
    return app


def register_extensions(app):
    bcrypt.init_app(app)
    mongo.init_app(app)
    socketio.init_app(app)
    return None


def register_blueprints(app):
    app.register_blueprint(users.bp, )
    app.register_blueprint(meetings.bp)
    app.register_blueprint(audio.bp)
    return None