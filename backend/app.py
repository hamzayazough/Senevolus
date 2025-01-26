from flask import Flask
from flask_cors import CORS
from decouple import config
from db import mongo, socketio
from services.ai_service import initialize_services
from services.s3_service import S3Service


def create_app():
    app = Flask(__name__)
    # Load configurations from .env
    app.config["MONGO_URI"] = config("MONGO_URI")
    app.config["SECRET_KEY"] = config("SECRET_KEY")
    app.config["S3_BUCKET_NAME"] = config("S3_BUCKET_NAME")
    app.config["AWS_REGION"] = config("AWS_REGION")
    app.config["AWS_ACCESS_KEY"] = config("AWS_ACCESS_KEY")
    app.config["AWS_SECRET_KEY"] = config("AWS_SECRET_KEY")
    print("MongoDB URI:", app.config["MONGO_URI"])

    # Initialize Flask extensions
    mongo.init_app(app)
    socketio.init_app(app)
    CORS(app)


    app.s3_service = S3Service(
        bucket_name=app.config["S3_BUCKET_NAME"],
        region=app.config["AWS_REGION"],
        access_key=app.config["AWS_ACCESS_KEY"],
        secret_key=app.config["AWS_SECRET_KEY"],
    )


    with app.app_context():
        print("Initializing AI services...")
        initialize_services()

    # Function to register blueprints
    def register_blueprints(app):
        from routes.user_routes import user_blueprint
        # You can add other blueprints like elder, volunteer, etc.
        from routes.socket_routes import socketio_handlers

        app.register_blueprint(user_blueprint, url_prefix="/api/users")
        # Add other blueprints if necessary
        socketio_handlers(socketio)

    register_blueprints(app)

    return app

if __name__ == "__main__":
    app = create_app()
    socketio.run(app, debug=True)
