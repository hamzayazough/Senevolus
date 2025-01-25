from db import mongo

# Add a new user
def add_user(user_data):
    """Insert a new user into the User collection."""
    mongo.db.User.insert_one(user_data)

# Update user details
def update_user(auth0_id, updated_data):
    """Update user details."""
    return mongo.db.User.update_one({"_id": auth0_id}, {"$set": updated_data})

# Retrieve a user by Auth0 ID
def get_user_by_id(auth0_id):
    """Retrieve a user document by their Auth0 ID."""
    return mongo.db.User.find_one({"_id": auth0_id})
