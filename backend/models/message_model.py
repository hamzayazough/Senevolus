from db import mongo

def add_message(message_data):
    """Insert a new message document into the TaskContractMessage collection."""
    return mongo.db.TaskContractMessage.insert_one(message_data).inserted_id

def get_messages_by_task(task_id):
    """Retrieve all messages associated with a specific task ID."""
    return list(mongo.db.TaskContractMessage.find({"task_id": task_id}))

def delete_messages_by_task(task_id):
    """Delete all messages associated with a specific task ID."""
    return mongo.db.TaskContractMessage.delete_many({"task_id": task_id})
