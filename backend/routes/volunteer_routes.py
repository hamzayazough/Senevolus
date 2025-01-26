from flask import Blueprint, request, jsonify
from models.task_model import get_elder_id_from_task, get_tasks_by_volunteer
from models.user_model import get_user_by_id

volunteer_blueprint = Blueprint("volunteer_routes", __name__)

# Get volunteer tasks
@volunteer_blueprint.route('/volunteer/<auth0_id>/tasks', methods=['GET'])
def volunteer_tasks(auth0_id):
    all_tasks = get_tasks_by_volunteer(auth0_id)
    return jsonify(all_tasks), 200

# Get new task requests
@volunteer_blueprint.route('/volunteer/<auth0_id>/new-task-requests', methods=['GET'])
def new_task_requests(auth0_id):
    res = {}
    all_tasks = get_tasks_by_volunteer(auth0_id)  # to change
    for task in all_tasks:
        if task['status'] == 'pending':
            res.update(task)
    return jsonify(res), 200

# Consult elder profile
@volunteer_blueprint.route('/consult-elder-profile/<_id>', methods=['GET'])
def consult_elder_profile(_id):
    elder_id = get_elder_id_from_task(_id)
    elder = get_user_by_id(elder_id)
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
