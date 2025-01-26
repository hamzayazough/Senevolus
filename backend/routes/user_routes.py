from flask import Blueprint, request, current_app, jsonify
from models.user_model import add_user, update_user, get_user_by_id
from services.ai_service import validate_id_and_face
from models.user_model import get_all_users
from werkzeug.utils import secure_filename

user_blueprint = Blueprint("user_routes", __name__)

@user_blueprint.route('/test', methods=['GET'])
def test_user_route():
    """Test user route."""
    print("User route works")
    return jsonify({"message": "User route works"}), 200


@user_blueprint.route('/<auth0_id>', methods=['POST'])
def validate_user(auth0_id):
    """Validate user images."""
    id_card = request.files.get('id_card')
    face_image = request.files.get('face_image')
    if not id_card or not face_image:
        return jsonify({"error": "ID card and face image are required"}), 400

    is_valid = validate_id_and_face(id_card, face_image)
    if is_valid:
        return jsonify({"message": "Validation successful"}), 200
    return jsonify({"error": "Validation failed"}), 400

@user_blueprint.route('/create/<auth0_id>', methods=['POST'])
def create_user(auth0_id):
    """Create a new user."""
    user_data = request.json
    if not user_data:
        return jsonify({"error": "Invalid user data"}), 400

    user_data["_id"] = auth0_id
    add_user(user_data)
    return jsonify({"message": "User created"}), 201

@user_blueprint.route('/update/<auth0_id>', methods=['PUT'])
def update_user_info(auth0_id):
    """Update user information."""
    updated_data = request.json
    if not updated_data:
        return jsonify({"error": "No data provided to update"}), 400

    result = update_user(auth0_id, updated_data)
    if result.modified_count > 0:
        return jsonify({"message": "User info updated"}), 200
    return jsonify({"message": "No changes made"}), 200

@user_blueprint.route('/<auth0_id>', methods=['GET'])
def get_user(auth0_id):
    """Retrieve a user by Auth0 ID."""
    user = get_user_by_id(auth0_id)
    if user:
        return jsonify(user), 200
    return jsonify({"error": "User not found"}), 404

@user_blueprint.route('/all', methods=['GET'])
def get_users():
    """Retrieve all users."""
    users = get_all_users()
    return jsonify(users), 200


@user_blueprint.route('/upload/<auth0_id>', methods=['POST'])
def upload_images_to_s3(auth0_id):
    if 'id_photo' not in request.files or 'person_photo' not in request.files:
        return jsonify({"error": "Missing files"}), 400

    id_photo = request.files['id_photo']
    person_photo = request.files['person_photo']

    if id_photo.filename == '' or person_photo.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        s3_service = current_app.s3_service

        id_photo_filename = secure_filename(f"{auth0_id}_id_photo.png")
        person_photo_filename = secure_filename(f"{auth0_id}_person_photo.png")

        id_photo_url = s3_service.upload_file(id_photo, id_photo_filename)
        person_photo_url = s3_service.upload_file(person_photo, person_photo_filename)

        return jsonify({
            "message": "Upload successful",
            "id_photo_url": id_photo_url,
            "person_photo_url": person_photo_url
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500