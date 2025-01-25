from app import mongo

def add_rating(rating_data):
    """Insert a new rating document into the VolunteerRating collection."""
    return mongo.db.VolunteerRating.insert_one(rating_data).inserted_id

def get_ratings_by_volunteer(volunteer_id):
    """Retrieve all ratings associated with a specific volunteer."""
    return list(mongo.db.VolunteerRating.find({"volunteer_id": volunteer_id}))

def get_rating_by_task(task_request_id):
    """Retrieve a rating associated with a specific task request ID."""
    return mongo.db.VolunteerRating.find_one({"task_request_id": task_request_id})
