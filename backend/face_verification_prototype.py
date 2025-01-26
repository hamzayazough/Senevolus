#!/usr/bin/env python
# coding: utf-8

# In[2]:


import tensorflow as tf
from deepface import DeepFace

print(f"TensorFlow version: {tf.__version__}")

# Test DeepFace functionality
try:
    models = DeepFace.build_model("Facenet")
    print("DeepFace is working correctly!")
except Exception as e:
    print(f"Error initializing DeepFace: {e}")



# In[8]:


from deepface import DeepFace

image1_path = r"C:\Users\hamza\Documents\dataset\older_people\img1_person1.jpg"
image2_path = r"C:\Users\hamza\Documents\dataset\older_people\img2_person1.jpg"



verification = DeepFace.verify(image1_path, image2_path, model_name="Facenet")
print("Verification result:", verification)


# In[9]:


from mtcnn import MTCNN ## library for face detection we are importing the face detection model MTCNN 
import cv2 ## OpenCV the goat of image processing
import os


# In[10]:


detector = MTCNN() ## instancing the face detection model


# In[11]:


def preprocess_image(image_path, target_size=(160, 160)):
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB) ## standadizing the color format
    faces = detector.detect_faces(img) ## return a list of detected faces
    if len(faces) > 0:
        x, y, w, h = faces[0]['box'] ## fetching the coordinates and dimensions of the first detected face
        face = img[y:y+h, x:x+w] ## cropping the image to only keep the face
        face = cv2.resize(face, target_size) ## 160x160 pixel
        return face / 255.0
    return None

print("preprocessing image method created")


# In[12]:


for category in ["young_adults", "older_people"]:
    folder = f"C:/Users/hamza/Documents/dataset/{category}"
    for file_name in os.listdir(folder):
        image_path = os.path.join(folder, file_name)
        processed_face = preprocess_image(image_path)
        if processed_face is not None:
            output_path = os.path.join(folder, f"processed_{file_name}")
            cv2.imwrite(output_path, processed_face * 255)
print("processed all images in the dataset")


# In[18]:


from keras.models import load_model


# In[23]:


import tensorflow as tf
print("TensorFlow version:", tf.__version__)

import keras
print("Keras version:", keras.__version__)


# In[29]:





# In[30]:


pip install keras-facenet


# In[31]:


from keras_facenet import FaceNet

# Initialize FaceNet
embedder = FaceNet()

print("FaceNet model loaded successfully!")



# In[32]:


import os
import numpy as np
from keras_facenet import FaceNet


# In[35]:


embedder = FaceNet()
def get_embedding(image_path):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image: {image_path}")
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # Converting to RGB
    return embedder.embeddings([img])[0]  # Extract embedding



# In[36]:


embeddings = {"young_adults": [], "older_people": []}
for category in ["young_adults", "older_people"]:
    folder = f"C:/Users/hamza/Documents/dataset/{category}"
    for file_name in os.listdir(folder):
        if file_name.startswith("processed_"):  # Use only preprocessed images to avoid bugs 
            image_path = os.path.join(folder, file_name)
            embedding = get_embedding(image_path)
            embeddings[category].append(embedding)

# Save embeddings to disk for later use
np.save("young_adults_embeddings.npy", embeddings["young_adults"])
np.save("older_people_embeddings.npy", embeddings["older_people"])
print("Embeddings extracted and saved!")


# In[38]:


pip install scikit-learn


# In[39]:


## configuring the labels
young_adults_embeddings = np.load("young_adults_embeddings.npy")
older_people_embeddings = np.load("older_people_embeddings.npy")

young_adults_labels = np.zeros(len(young_adults_embeddings))
older_people_labels = np.ones(len(older_people_embeddings))

X = np.concatenate([young_adults_embeddings, older_people_embeddings], axis=0)
y = np.concatenate([young_adults_labels, older_people_labels], axis=0)

from sklearn.utils import shuffle
X, y = shuffle(X, y, random_state=42)


# In[40]:


from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

# Spliting our data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Training a logistic regression classifier
classifier = LogisticRegression()
classifier.fit(X_train, y_train)

# Evaluation of the model
y_pred = classifier.predict(X_test)
print("Classification Report:")
print(classification_report(y_test, y_pred))
print("Accuracy:", accuracy_score(y_test, y_pred))


# In[41]:


import joblib

joblib.dump(classifier, "age_classifier.pkl")
print("Classifier saved successfully!")


# In[43]:


def predict_age_group(image_path):
    embedding = get_embedding(image_path)
    prediction = classifier.predict([embedding])
    return "Young Adult" if prediction[0] == 0 else "Older Person"

image_path = "testing-images/img1_test6.jpg"
print("Predicted Age Group:", predict_age_group(image_path))


# In[46]:


from scipy.spatial.distance import euclidean

def verify_faces(image1_path, image2_path, threshold=0.8):
    embedding1 = get_embedding(image1_path)
    embedding2 = get_embedding(image2_path)
    distance = euclidean(embedding1, embedding2)
    return distance < threshold, distance

# Little test on images
image1 = "testing-images/img1_test6.jpg"
image2 = "testing-images/img2_test4.jpg"
is_same, distance = verify_faces(image1, image2)
print(f"Are the same person? {is_same} (Distance: {distance})")


# In[47]:


from scipy.spatial.distance import euclidean

# Function to verify faces
def verify_faces(image1_path, image2_path, threshold=0.8):
    embedding1 = get_embedding(image1_path)
    embedding2 = get_embedding(image2_path)
    distance = euclidean(embedding1, embedding2)
    return distance < threshold, distance

folder_path = "testing-images"
num_people = 6 
threshold = 0.8

results = []

for i in range(1, num_people + 1):
    img1 = f"{folder_path}/img1_test{i}.jpg"
    img2 = f"{folder_path}/img2_test{i}.jpg"
    is_same, distance = verify_faces(img1, img2, threshold)
    results.append({
        "Test Type": "Same Person",
        "Person": i,
        "Image 1": img1,
        "Image 2": img2,
        "Model Prediction": "Same" if is_same else "Different",
        "Distance": distance
    })
    print(f"Person {i} - Same Person Test: {is_same} (Distance: {distance})")

    for j in range(1, num_people + 1):
        if i != j: 
            img_other = f"{folder_path}/img2_test{j}.jpg"
            is_same, distance = verify_faces(img1, img_other, threshold)
            results.append({
                "Test Type": "Different Person",
                "Person 1": i,
                "Person 2": j,
                "Image 1": img1,
                "Image 2": img_other,
                "Model Prediction": "Same" if is_same else "Different",
                "Distance": distance
            })
            print(f"Person {i} vs Person {j} - Different Person Test: {is_same} (Distance: {distance})")


# In[ ]:


import pandas as pd

df = pd.DataFrame(results)
df.to_csv("verification_results.csv", index=False)
print("Testing complete. Results saved to 'verification_results.csv'.")


# ## Not as good as expected to differentiate other people but due to time constraints we are gonna go with that

# In[48]:


import joblib

# Saving the classifier
joblib.dump(clf, "logistic_regression_model.pkl")
print("Classifier saved successfully!")

threshold = 0.8
with open("threshold.txt", "w") as f:
    f.write(str(threshold))


# In[ ]:




