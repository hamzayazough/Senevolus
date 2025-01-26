from decouple import config

MONGO_URI = config("MONGO_URI")
SECRET_KEY = config("SECRET_KEY")

AWS_ACCESS_KEY = config("AWS_ACCESS_KEY")
AWS_SECRET_KEY = config("AWS_SECRET_KEY")
AWS_BUCKET_NAME = config("AWS_BUCKET_NAME")
