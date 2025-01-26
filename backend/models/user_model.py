from db import mongo
from pymongo.errors import PyMongoError

# Add a new user
def add_user(user_data):
    """Insert a new user into the User collection."""
    try:
        result = mongo.db.User.insert_one(user_data)
        return {"success": True, "inserted_id": str(result.inserted_id)}
    except PyMongoError as e:
        return {"success": False, "error": str(e)}

# Update user details
def update_user(auth0_id, updated_data):
    """Update user details."""
    try:
        result = mongo.db.User.update_one({"_id": auth0_id}, {"$set": updated_data})
        return result

    except PyMongoError as e:
        raise Exception(f"Database error: {str(e)}")

# Retrieve a user by Auth0 ID
def get_user_by_id(auth0_id):
    """Retrieve a user document by their Auth0 ID."""
    try:
        user = mongo.db.User.find_one({"_id": auth0_id})
        if user:
            user["_id"] = str(user["_id"])  # Convert ObjectId to string if needed
        return {"success": True, "data": user} if user else {"success": False, "message": "User not found"}
    except PyMongoError as e:
        return {"success": False, "error": str(e)}

def get_all_users():
    """Retrieve all user documents."""
    try:
        print("get_all_users")
        users = list(mongo.db.User.find())
        for user in users:
            user["_id"] = str(user["_id"])  # Convert ObjectId to string if needed
        return {"success": True, "data": users}
    except PyMongoError as e:
        return {"success": False, "error": str(e)}