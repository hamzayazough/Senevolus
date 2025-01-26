from flask_pymongo import PyMongo
from flask_socketio import SocketIO

mongo = PyMongo()
socketio = SocketIO(cors_allowed_origins="*")