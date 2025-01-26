from flask import Flask, request, jsonify
import boto3
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

# S3 Configuration
S3_BUCKET = 'your-s3-bucket-name'
S3_REGION = 'your-s3-region'
S3_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY_ID')
S3_SECRET_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

s3_client = boto3.client(
    's3',
    aws_access_key_id=S3_ACCESS_KEY,
    aws_secret_access_key=S3_SECRET_KEY,
    region_name=S3_REGION
)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'idPhoto' not in request.files or 'personPhoto' not in request.files:
        return jsonify({"error": "Missing files"}), 400

    id_photo = request.files['idPhoto']
    person_photo = request.files['personPhoto']

    if id_photo.filename == '' or person_photo.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Upload ID Photo
        id_photo_filename = secure_filename(id_photo.filename)
        s3_client.upload_fileobj(
            id_photo,
            S3_BUCKET,
            id_photo_filename,
            ExtraArgs={'ACL': 'public-read'}
        )
        id_photo_url = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{id_photo_filename}"

        # Upload Person Photo
        person_photo_filename = secure_filename(person_photo.filename)
        s3_client.upload_fileobj(
            person_photo,
            S3_BUCKET,
            person_photo_filename,
            ExtraArgs={'ACL': 'public-read'}
        )
        person_photo_url = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{person_photo_filename}"

        return jsonify({
            "message": "Upload successful",
            "id_photo_url": id_photo_url,
            "person_photo_url": person_photo_url
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)