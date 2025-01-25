from flask import Blueprint, request, jsonify
from models.task_model import (get_active_tasks, get_previous_tasks, create_task,
                               delete_task, rate_volunteer, get_volunteer_to_evaluate,
                               get_task_messages)
from models.user_model import get_user_with_ratings

elder_blueprint = Blueprint("elder_routes", __name__)

@elder_blueprint.route('/elder/<auth0_id>/active-task-requests', methods=['GET'])
def active_task_requests(auth0_id):
    tasks = get_active_tasks(auth0_id)
    return jsonify(tasks), 200

@elder_blueprint.route('/elder/<auth0_id>/previous-task-requests', methods=['GET'])
def previous_task_requests(auth0_id):
    tasks = get_previous_tasks(auth0_id)
    return jsonify(tasks), 200

@elder_blueprint.route('/elder/<auth0_id>/delete-task-request/<request_id>', methods=['DELETE'])
def delete_task_request(auth0_id, request_id):
    delete_task(auth0_id, request_id)
    return jsonify({"message": "Task deleted"}), 200

@elder_blueprint.route('/elder/<auth0_id>/new-request', methods=['POST'])
def new_task_request(auth0_id):
    task_data = request.json
    create_task(auth0_id, task_data)
    return jsonify({"message": "Task created"}), 201

@elder_blueprint.route('/elder/<auth0_id>/rate-volunteer/<volunteer_id>/<task_request_id>', methods=['POST'])
def rate_volunteer_task(auth0_id, volunteer_id, task_request_id):
    rating_data = request.json
    rate_volunteer(auth0_id, volunteer_id, task_request_id, rating_data)
    return jsonify({"message": "Volunteer rated"}), 200

@elder_blueprint.route('/elder/<auth0_id>/task-requests-messages/<task_request_id>', methods=['GET'])
def get_messages(auth0_id, task_request_id):
    messages = get_task_messages(task_request_id)
    return jsonify(messages), 200

@elder_blueprint.route('/elder/<auth0_id>/consult-volunteer-profile/<volunteer_id>', methods=['GET'])
def consult_volunteer_profile(auth0_id, volunteer_id):
    volunteer = get_user_with_ratings(volunteer_id)
    return jsonify(volunteer), 200
