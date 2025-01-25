from flask import Blueprint, request, jsonify
from models.task_model import get_new_task_requests, accept_task, confirm_task_completion
from models.user_model import get_user_with_ratings

volunteer_blueprint = Blueprint("volunteer_routes", __name__)

# Get new task requests
@volunteer_blueprint.route('/volunteer/<auth0_id>/new-task-requests', methods=['GET'])
def new_task_requests(auth0_id):
    tasks = get_new_task_requests()
    return jsonify(tasks), 200

# Consult elder profile
@volunteer_blueprint.route('/volunteer/<auth0_id>/consult-elder-profile/<elder_id>', methods=['GET'])
def consult_elder_profile(auth0_id, elder_id):
    elder = get_user_with_ratings(elder_id)
    return jsonify(elder), 200

# Accept a task
@volunteer_blueprint.route('/volunteer/<auth0_id>/take-task/<task_request_id>', methods=['POST'])
def take_task(auth0_id, task_request_id):
    accept_task(auth0_id, task_request_id)
    return jsonify({"message": "Task accepted"}), 200

# Confirm task completion
@volunteer_blueprint.route('/volunteer/<auth0_id>/confirm-task-completion/<task_request_id>', methods=['POST'])
def confirm_task(auth0_id, task_request_id):
    images = request.files
    is_valid = confirm_task_completion(auth0_id, task_request_id, images)
    if is_valid:
        return jsonify({"message": "Task completed"}), 200
    return jsonify({"error": "Image validation failed"}), 400
