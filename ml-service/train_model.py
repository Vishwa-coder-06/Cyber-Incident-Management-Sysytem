import os
import pandas as pd
import joblib

from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "incidents.csv"
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "model"
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "incident_classifier.pkl"
)


# Load dataset
df = pd.read_csv(DATA_PATH)

df["description"] = df["description"].fillna("")
df["category"] = df["category"].fillna("Unknown")


X = df["description"]
y = df["category"]


# TF-IDF + SVM
model = Pipeline([
    (
        "tfidf",
        TfidfVectorizer(
            lowercase=True,
            stop_words="english",
            ngram_range=(1, 2)
        )
    ),
    (
        "svm",
        SVC(
            probability=True,
            kernel="linear"
        )
    )
])


print("Training model...")

model.fit(X, y)


os.makedirs(MODEL_DIR, exist_ok=True)

joblib.dump(
    model,
    MODEL_PATH
)


print("Model trained successfully.")
print("Model saved to:")
print(MODEL_PATH)
