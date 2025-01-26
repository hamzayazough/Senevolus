from flask import Blueprint, request, jsonify
from models.task_model import (get_tasks_by_elder_and_status, create_task, delete_task)
# from models.user_model import get_user_with_ratings

elder_blueprint = Blueprint("elder", __name__)

@elder_blueprint.route('/active-task-requests/<auth0_id>', methods=['GET'])
def active_task_requests(auth0_id):
    tasks = get_tasks_by_elder_and_status(auth0_id, 'active')
    return jsonify(tasks), 200

@elder_blueprint.route('/delete-task-request/<request_id>', methods=['DELETE'])
def delete_task_request(request_id):
    delete_task(request_id)
    return jsonify({"message": "Task deleted"}), 200

@elder_blueprint.route('/new-request/<auth0_id>', methods=['POST'])
def new_task_request(auth0_id):
    task_data = request.json
    task_data["elder_id"] = auth0_id
    create_task(task_data)
    return jsonify({"message": "Task created"}), 201

@elder_blueprint.route('/completed-tasks/<auth0_id>', methods=['GET'])
def completed_tasks(auth0_id):
    tasks = get_tasks_by_elder_and_status(auth0_id, 'completed')
    return jsonify(tasks), 200





# @elder_blueprint.route('/<auth0_id>/rate-volunteer/<volunteer_id>/<task_request_id>', methods=['POST'])
# def rate_volunteer_task(auth0_id, volunteer_id, task_request_id):
#     rating_data = request.json
#     rate_volunteer(auth0_id, volunteer_id, task_request_id, rating_data)
#     return jsonify({"message": "Volunteer rated"}), 200

# @elder_blueprint.route('/<auth0_id>/task-requests-messages/<task_request_id>', methods=['GET'])
# def get_messages(auth0_id, task_request_id):
#     messages = get_task_messages(task_request_id)
#     return jsonify(messages), 200

# @elder_blueprint.route('/<auth0_id>/consult-volunteer-profile/<volunteer_id>', methods=['GET'])
# def consult_volunteer_profile(auth0_id, volunteer_id):
#     volunteer = get_user_with_ratings(volunteer_id)
#     return jsonify(volunteer), 200
