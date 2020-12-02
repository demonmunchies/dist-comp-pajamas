from flask_bcrypt import Bcrypt
from flask_pymongo import PyMongo
from flask_socketio import SocketIO
from flask_cors import CORS


bcrypt = Bcrypt()
mongo = PyMongo()
socketio = SocketIO()
cors = CORS()
