from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_socketio import SocketIO
from decouple import config

app = Flask(__name__)

app.config["MONGO_URI"] = config("MONGO_URI")
app.config["SECRET_KEY"] = config("SECRET_KEY")

mongo = PyMongo(app)
socketio = SocketIO(app, cors_allowed_origins="*")  # SocketIO for WebSocket communication
CORS(app)  # Cross-Origin Resource Sharing

# Import blueprints inside a function to avoid circular imports
def register_blueprints(app):
    from routes.user_routes import user_blueprint
    from routes.elder_routes import elder_blueprint
    from routes.volunteer_routes import volunteer_blueprint
    from routes.socket_routes import socketio_handlers

    app.register_blueprint(user_blueprint, url_prefix="/api")
    app.register_blueprint(elder_blueprint, url_prefix="/api")
    app.register_blueprint(volunteer_blueprint, url_prefix="/api")

    socketio_handlers(socketio)

register_blueprints(app)

@app.route('/test-mongo', methods=['GET'])
def test_mongo():
    try:
        db_names = mongo.cx.list_database_names()  # List all databases
        return {"status": "success", "databases": db_names}, 200
    except Exception as e:
        return {"status": "error", "message": str(e)}, 500


if __name__ == "__main__":
    socketio.run(app, debug=True)
