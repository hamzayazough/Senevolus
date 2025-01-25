from flask import Blueprint, request, jsonify
from models.user_model import add_user, update_user_info, validate_user_images
from services.ai_service import validate_id_and_face

user_blueprint = Blueprint("user_routes", __name__)

@user_blueprint.route('/user/<auth0_id>', methods=['POST'])
def validate_user(auth0_id):
    id_card = request.files['id_card']
    face_image = request.files['face_image']
    if validate_id_and_face(id_card, face_image):
        return jsonify({"message": "Validation successful"}), 200
    return jsonify({"error": "Validation failed"}), 400

@user_blueprint.route('/create/<auth0_id>', methods=['POST'])
def create_user(auth0_id):
    user_data = request.json
    user_data["_id"] = auth0_id
    add_user(user_data)
    return jsonify({"message": "User created"}), 201

@user_blueprint.route('/user/update/<auth0_id>', methods=['PUT'])
def update_user(auth0_id):
    updated_data = request.json
    update_user_info(auth0_id, updated_data)
    return jsonify({"message": "User info updated"}), 200
