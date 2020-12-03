from flask_bcrypt import Bcrypt
from flask_pymongo import PyMongo
from flask_socketio import SocketIO
from flask_cors import CORS
from pajamas.model import BertTK

bcrypt = Bcrypt()
mongo = PyMongo()
socketio = SocketIO()
cors = CORS()
model = BertTK()
