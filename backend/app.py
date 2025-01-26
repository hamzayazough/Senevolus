from flask import Flask
from flask_cors import CORS
from decouple import config
from db import mongo, socketio

def create_app():
    app = Flask(__name__)

    # Load configurations from .env
    app.config["MONGO_URI"] = config("MONGO_URI")
    app.config["SECRET_KEY"] = config("SECRET_KEY")
    print("MongoDB URI:", app.config["MONGO_URI"])

    # Initialize Flask extensions
    mongo.init_app(app)
    socketio.init_app(app)
    CORS(app)

    # Function to register blueprints
    def register_blueprints(app):
        from routes.user_routes import user_blueprint
        from routes.elder_routes import elder_blueprint
        from routes.volunteer_routes import volunteer_blueprint
        # You can add other blueprints like elder, volunteer, etc.
        from routes.socket_routes import socketio_handlers

        app.register_blueprint(user_blueprint, url_prefix="/api/users")
        app.register_blueprint(elder_blueprint, url_prefix="/api/elders")
        app.register_blueprint(volunteer_blueprint, url_prefix="/api/volunteers")
        # Add other blueprints if necessary
        socketio_handlers(socketio)

    register_blueprints(app)

    @app.route('/test-mongo', methods=['GET'])
    def test_mongo():
        """Test MongoDB connection."""
        try:
            db_names = mongo.cx.list_database_names()
            return {"status": "success", "databases": db_names}, 200
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500

    return app

if __name__ == "__main__":
    app = create_app()
    socketio.run(app, debug=True)
