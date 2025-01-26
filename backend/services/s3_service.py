from flask import current_app
import boto3
from werkzeug.utils import secure_filename

class S3Service:
    def __init__(self, bucket_name, region, access_key, secret_key):
        self.bucket_name = bucket_name
        self.region = region
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region
        )

    def upload_file(self, file_obj, filename):
        try:
            self.s3_client.upload_fileobj(
                file_obj,
                self.bucket_name,
                filename,
                ExtraArgs={'ACL': 'public-read'}
            )
            return f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com/{filename}"
        except Exception as e:
            current_app.logger.error(f"Failed to upload file: {e}")
            raise e
