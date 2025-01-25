# filepath: /C:/Users/hamza/Documents/Senevolus/backend/services/ai_service.py
import cv2
import numpy as np
import tensorflow as tf
from flask import current_app
import boto3
from botocore.exceptions import NoCredentialsError

face_verification_model = None
s3 = None

def initialize_services():
    global face_verification_model, s3

    # Load the pre-trained AI model (ensure model.h5 is in the correct location)
    MODEL_PATH = "models/face_verification_model.h5"

    try:
        face_verification_model = tf.keras.models.load_model(MODEL_PATH)
    except Exception as e:
        face_verification_model = None
        current_app.logger.error(f"Failed to load AI model: {e}")

    # AWS S3 Setup
    s3 = boto3.client(
        "s3",
        aws_access_key_id=current_app.config.get("AWS_ACCESS_KEY"),
        aws_secret_access_key=current_app.config.get("AWS_SECRET_KEY"),
        region_name=current_app.config.get("AWS_REGION"),
    )

def preprocess_image(image):
    """
    Preprocess the input image for the AI model.
    Resizes to 224x224 (or the size expected by your model) and normalizes pixel values.
    """
    try:
        img_array = np.frombuffer(image.read(), np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        img = cv2.resize(img, (224, 224))  # Resize to match the model input
        img = img / 255.0  # Normalize pixel values
        return np.expand_dims(img, axis=0)  # Add batch dimension
    except Exception as e:
        current_app.logger.error(f"Failed to preprocess image: {e}")
        return None

def validate_id_and_face(id_card_image, face_image):
    """
    Validate that the person in the ID card matches the person in the selfie image.
    Returns True if the validation succeeds, False otherwise.
    """
    if not face_verification_model:
        current_app.logger.error("AI model not loaded. Validation cannot proceed.")
        return False

    try:
        id_card_processed = preprocess_image(id_card_image)
        face_processed = preprocess_image(face_image)

        if id_card_processed is None or face_processed is None:
            current_app.logger.error("Failed to preprocess one or both images.")
            return False

        # Run the model's prediction (this assumes the model outputs similarity as a float)
        similarity_score = face_verification_model.predict([id_card_processed, face_processed])[0][0]
        return similarity_score > 0.5  # Adjust threshold based on your model's performance
    except Exception as e:
        current_app.logger.error(f"Error during validation: {e}")
        return False

def fetch_user_image_from_s3(user_id, image_type="photo_id"):
    """
    Fetch an image (photo_id or id_card) from AWS S3.
    """
    try:
        bucket_name = current_app.config.get("S3_BUCKET_NAME")
        file_key = f"{user_id}/{image_type}.jpg"

        s3_response = s3.get_object(Bucket=bucket_name, Key=file_key)
        return s3_response["Body"].read()
    except NoCredentialsError:
        current_app.logger.error("AWS credentials not found.")
    except Exception as e:
        current_app.logger.error(f"Failed to fetch image from S3: {e}")
    return None

def validate_task_completion(elder_id, volunteer_id, selfie_image):
    """
    Validate task completion by comparing the elder's and volunteer's faces in the selfie image.
    Fetch stored images of the elder and volunteer from S3 for comparison.
    """
    try:
        elder_image = fetch_user_image_from_s3(elder_id, image_type="photo_id")
        volunteer_image = fetch_user_image_from_s3(volunteer_id, image_type="photo_id")

        if not elder_image or not volunteer_image:
            current_app.logger.error("Could not fetch one or both user images from S3.")
            return False

        elder_processed = preprocess_image(elder_image)
        volunteer_processed = preprocess_image(volunteer_image)
        selfie_processed = preprocess_image(selfie_image)

        if not elder_processed or not volunteer_processed or not selfie_processed:
            current_app.logger.error("Failed to preprocess one or more images.")
            return False

        # Validate elder in the selfie
        elder_similarity = face_verification_model.predict([elder_processed, selfie_processed])[0][0]

        # Validate volunteer in the selfie
        volunteer_similarity = face_verification_model.predict([volunteer_processed, selfie_processed])[0][0]

        # Check if both elder and volunteer are recognized in the selfie
        return elder_similarity > 0.5 and volunteer_similarity > 0.5
    except Exception as e:
        current_app.logger.error(f"Error during task completion validation: {e}")
        return False