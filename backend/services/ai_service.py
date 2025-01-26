from keras.models import Model
from keras.layers import Input, Conv2D, BatchNormalization, Activation, MaxPooling2D, Flatten, Dense
import cv2
import numpy as np
import tensorflow as tf
from flask import current_app
import boto3
from botocore.exceptions import NoCredentialsError
from scipy.spatial.distance import euclidean
import os
face_embedding_model = None
s3 = None


def initialize_services():
    global face_embedding_model, s3
    print("Initializing services...")

    try:
        print("Recreating FaceNet model and loading weights...")
        face_embedding_model = create_facenet_model()
        model_weights_path = "facenet_keras.h5"
        import os

        model_weights_path = "facenet_keras.h5"
        if not os.path.exists(model_weights_path):
            print(f"Model weights file not found at {model_weights_path}")
        else:
            print(f"Model weights file found at {model_weights_path}")

        face_embedding_model.load_weights(model_weights_path)
        current_app.logger.info("Face verification model loaded successfully.")
    except Exception as e:
        current_app.logger.error(f"Failed to load FaceNet weights: {e}")

    try:
        s3 = boto3.client(
            "s3",
            aws_access_key_id=current_app.config.get("AWS_ACCESS_KEY"),
            aws_secret_access_key=current_app.config.get("AWS_SECRET_KEY"),
            region_name=current_app.config.get("AWS_REGION"),
        )
    except Exception as e:
        current_app.logger.error(f"Failed to initialize S3 client: {e}")


def create_facenet_model():
    input_layer = Input(shape=(160, 160, 3))
    x = Conv2D(32, (3, 3), activation='relu')(input_layer)
    x = BatchNormalization()(x)
    x = MaxPooling2D(pool_size=(2, 2))(x)
    x = Flatten()(x)
    output_layer = Dense(128, activation='relu')(x)

    model = Model(inputs=input_layer, outputs=output_layer)
    return model


def preprocess_image(image):

    """
    Preprocess the input image for the AI model.
    Resizes to 224x224 (or the size expected by your model) and normalizes pixel values.
    """
    try:
        img_array = np.frombuffer(image.read(), np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        img = cv2.resize(img, (160, 160))  # Resize to match the model input
        img = img / 255.0 
        return np.expand_dims(img, axis=0)  # Add batch dimension
    except Exception as e:
        current_app.logger.error(f"Failed to preprocess image: {e}")
        return None


def get_embedding(model, processed_image):
    """
    Generate FaceNet embeddings for the given preprocessed image.
    """
    try:
        return model.predict(processed_image)[0]
    except Exception as e:
        current_app.logger.error(f"Failed to generate embedding: {e}")
        return None
    

def validate_id_and_face(id_card_image, face_image, threshold=0.8):
    """
    Validate that the person in the ID card matches the person in the selfie image.
    Returns True if the validation succeeds, False otherwise.
    """
    if not face_embedding_model:
        current_app.logger.error("AI model not loaded. Validation cannot proceed.")
        return False

    try:
        print("Preprocessing images...")
        id_card_processed = preprocess_image(id_card_image)
        face_processed = preprocess_image(face_image)

        if id_card_processed is None or face_processed is None:
            current_app.logger.error("Failed to preprocess one or both images.")
            return False

        print("Generating embeddings...")
        id_card_embedding = get_embedding(face_embedding_model, id_card_processed)
        face_embedding = get_embedding(face_embedding_model, face_processed)

        if id_card_embedding is None or face_embedding is None:
            current_app.logger.error("Failed to generate embeddings.")
            return False

        distance = euclidean(id_card_embedding, face_embedding)
        print("Distance:", distance)
        is_same_person = distance < threshold

        current_app.logger.info(f"Distance: {distance}, Is same person: {is_same_person}")
        return is_same_person
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

def validate_task_completion(elder_id, volunteer_id, selfie_image, threshold=0.8):
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
        elder_embedding = get_embedding(face_embedding_model, elder_processed)
        selfie_embedding = get_embedding(face_embedding_model, selfie_processed)

        elder_similarity = euclidean(elder_embedding, selfie_embedding)

        # Validate volunteer in the selfie
        volunteer_embedding = get_embedding(face_embedding_model, volunteer_processed)
        volunteer_similarity = euclidean(volunteer_embedding, selfie_embedding)

        # Check if both elder and volunteer are recognized in the selfie
        return elder_similarity < threshold and volunteer_similarity < threshold
    except Exception as e:
        current_app.logger.error(f"Error during task completion validation: {e}")
        return False