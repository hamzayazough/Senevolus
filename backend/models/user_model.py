from app import mongo

def add_user(user_data):
    """Insert a new user into the User collection."""
    return mongo.db.User.insert_one(user_data).inserted_id

def get_user_by_id(auth0_id):
    """Retrieve a user document by their Auth0 ID."""
    return mongo.db.User.find_one({"_id": auth0_id})

def update_user(auth0_id, updates):
    """Update user details."""
    return mongo.db.User.update_one({"_id": auth0_id}, {"$set": updates})

def increment_user_points(auth0_id, points):
    """Increment a user's points."""
    return mongo.db.User.update_one({"_id": auth0_id}, {"$inc": {"points": points}})
