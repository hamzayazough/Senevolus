from flask import Blueprint, request, jsonify
from models.task_model import get_elder_id_from_task, get_tasks_by_status, update_task_status, confirm_task_completion, get_tasks_by_volunteer_and_status
from models.user_model import get_user_by_id

volunteer_blueprint = Blueprint("volunteer_routes", __name__)

# Get all pending tasks
@volunteer_blueprint.route('/volunteer/new-task-requests', methods=['GET'])
def new_task_requests():
    return jsonify(get_tasks_by_status('pending')), 200

# Consult elder profile
@volunteer_blueprint.route('/consult-elder-profile/<_id>', methods=['GET'])
def consult_elder_profile(_id):
    elder_id = get_elder_id_from_task(_id)
    elder = get_user_by_id(elder_id)
    return jsonify(elder), 200

# Accept a task
@volunteer_blueprint.route('/volunteer/<auth0_id>/take-task/<task_request_id>', methods=['POST'])
def take_task(auth0_id, task_request_id):
    update_task_status(task_request_id, 'accepted', auth0_id)
    return jsonify({"message": "Task accepted"}), 200

# Get all accepted tasks
@volunteer_blueprint.route('/volunteer/<auth0_id>/accepted-tasks', methods=['GET'])
def accepted_tasks(auth0_id):
    return jsonify(get_tasks_by_volunteer_and_status(auth0_id, 'accepted')), 200

# Confirm task completion
@volunteer_blueprint.route('/volunteer/<auth0_id>/confirm-task-completion/<task_request_id>', methods=['POST'])
def confirm_task(auth0_id, task_request_id):
    images = request.files
    # To be implemented by the goat Hamza
    is_valid = confirm_task_completion(auth0_id, task_request_id, images)
    if is_valid:
        return jsonify({"message": "Task completed"}), 200
    return jsonify({"error": "Image validation failed"}), 400
