from db import mongo

def create_task(task_data):
    """Insert a new task into the TaskRequest collection."""
    mongo.db.TaskRequest.insert_one(task_data)

def get_tasks_by_status(status):
    """Retrieve tasks with a specific status."""
    return list(mongo.db.TaskRequest.find({"status": status}))

def get_tasks_by_elder_and_status(elder_id, status):
    """Retrieve tasks with a specific status."""
    return list(mongo.db.TaskRequest.find({"elder_id": elder_id, "status": status}))

def get_tasks_by_volunteer_and_status(volunteer_id, status):
    """Retrieve tasks with a specific status."""
    return list(mongo.db.TaskRequest.find({"volunteer_id": volunteer_id, "status": status}))

def get_tasks_by_elder(elder_id):
    """Retrieve tasks created by a specific elder."""
    return list(mongo.db.TaskRequest.find({"elder_id": elder_id}))

def get_tasks_by_volunteer(volunteer_id):
    """Retrieve tasks assigned to a specific volunteer."""
    return list(mongo.db.TaskRequest.find({"volunteer_id": volunteer_id}))

def update_task_status(task_id, status, vol_id=None):
    """Update the status of a specific task."""
    if vol_id:
        return mongo.db.TaskRequest.update_one({"_id": task_id}, {"$set": {"status": status, "volunteer_id": vol_id}})
    return mongo.db.TaskRequest.update_one({"_id": task_id}, {"$set": {"status": status}})

def update_task(task_id, updates):
    """Update details of a specific task."""
    return mongo.db.TaskRequest.update_one({"_id": task_id}, {"$set": updates})

def delete_task(task_id):
    """Delete a specific task by its ID."""
    return mongo.db.TaskRequest.delete_one({"_id": task_id})

def get_elder_id_from_task(task_request_id):
    """Retrieve the elder ID associated with a specific task request ID."""
    return mongo.db.TaskRequest.find_one({"_id": task_request_id})['elder_id']

def confirm_task_completion(volunteer_id, task_id, images):
    """Confirm task completion by a volunteer."""
    task = mongo.db.TaskRequest.find_one({"_id": task_id})
    if not task:
        return False
    else:
        # Validate images
        # A FAIRE AU PLUS VITE S'IL VOUS PLAIT
        # Update task status
        return True