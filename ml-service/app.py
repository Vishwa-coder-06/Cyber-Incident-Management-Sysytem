import os
import joblib
import pandas as pd

from flask import Flask, request, jsonify
from flask_cors import CORS

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# =========================================================
# FLASK APP
# =========================================================

app = Flask(__name__)
CORS(app)


# =========================================================
# PATHS
# =========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "incident_classifier.pkl"
)

DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "incidents.csv"
)


# =========================================================
# LOAD MODEL
# =========================================================

print("Loading ML model...")

model = joblib.load(MODEL_PATH)

print("ML model loaded successfully.")


# =========================================================
# LOAD HISTORICAL DATA
# =========================================================

print("Loading historical incidents...")

historical_data = pd.read_csv(DATA_PATH)

historical_data["description"] = (
    historical_data["description"]
    .fillna("")
)

historical_data["category"] = (
    historical_data["category"]
    .fillna("")
)

historical_data["root_cause"] = (
    historical_data["root_cause"]
    .fillna("")
)

print(
    "Historical incidents loaded:",
    len(historical_data)
)


# =========================================================
# SIMILARITY MODEL
# =========================================================

similarity_vectorizer = TfidfVectorizer(
    lowercase=True,
    stop_words="english",
    ngram_range=(1, 2)
)

historical_vectors = (
    similarity_vectorizer.fit_transform(
        historical_data["description"]
    )
)

print("Similarity model ready.")


# =========================================================
# PLAYBOOKS
# =========================================================

PLAYBOOKS = {

    "Phishing": {
        "title": "Phishing Response Playbook",
        "advice": (
            "Reset affected credentials, block malicious sender "
            "domains, remove malicious messages and enable MFA."
        )
    },

    "Ransomware": {
        "title": "Ransomware Incident Response Playbook",
        "advice": (
            "Immediately isolate affected systems, preserve evidence "
            "and restore systems from verified clean backups."
        )
    },

    "DDoS": {
        "title": "DDoS Mitigation Playbook",
        "advice": (
            "Apply traffic filtering and rate limiting, block malicious "
            "sources and activate upstream DDoS protection."
        )
    },

    "Insider Threat": {
        "title": "Insider Threat Response Playbook",
        "advice": (
            "Restrict the affected user's access, preserve audit logs "
            "and investigate unauthorized data transfers."
        )
    },

    "Lateral Movement": {
        "title": "Lateral Movement Response Playbook",
        "advice": (
            "Isolate compromised systems, revoke compromised credentials "
            "and investigate internal authentication activity."
        )
    }
}


# =========================================================
# HEALTH CHECK
# =========================================================

@app.route("/health", methods=["GET"])
def health():

    print("Health check received.")

    return jsonify({
        "status": "UP",
        "service": "SecureOps ML Service"
    })


# =========================================================
# AI PREDICTION
# =========================================================

@app.route("/predict", methods=["POST"])
def predict():

    print("Prediction request received.")

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "error": "Request body is required"
            }), 400


        description = data.get(
            "description",
            ""
        )


        if not description:

            return jsonify({
                "error": "description is required"
            }), 400


        description = description.strip()


        print(
            "Incident description:",
            description
        )


        # =================================================
        # CLASSIFICATION
        # =================================================

        prediction = model.predict(
            [description]
        )[0]


        probabilities = model.predict_proba(
            [description]
        )[0]


        confidence = float(
            max(probabilities)
        )


        print(
            "Prediction:",
            prediction
        )

        print(
            "Confidence:",
            confidence
        )


        # =================================================
        # HISTORICAL SIMILARITY
        # =================================================

        input_vector = (
            similarity_vectorizer.transform(
                [description]
            )
        )


        similarities = cosine_similarity(
            input_vector,
            historical_vectors
        )[0]


        best_indexes = (
            similarities.argsort()[-3:][::-1]
        )


        similar_incidents = []


        for index in best_indexes:

            similar_incidents.append({

                "description":
                    str(
                        historical_data.iloc[index][
                            "description"
                        ]
                    ),

                "category":
                    str(
                        historical_data.iloc[index][
                            "category"
                        ]
                    ),

                "similarity":
                    round(
                        float(
                            similarities[index]
                        ),
                        3
                    )
            })


        # =================================================
        # ROOT CAUSE
        # =================================================

        best_index = best_indexes[0]

        root_cause = str(
            historical_data.iloc[
                best_index
            ]["root_cause"]
        )


        # =================================================
        # PLAYBOOK
        # =================================================

        playbook = PLAYBOOKS.get(
            prediction,
            {
                "title":
                    "General Incident Response Playbook",

                "advice":
                    (
                        "Collect evidence, isolate affected "
                        "systems and perform further investigation."
                    )
            }
        )


        # =================================================
        # RESPONSE
        # =================================================

        result = {

            "attackType":
                prediction,

            "confidence":
                round(
                    confidence,
                    4
                ),

            "rootCause":
                root_cause,

            "immediateAdvice":
                playbook["advice"],

            "recommendedPlaybookTitle":
                playbook["title"],

            "similarIncidents":
                similar_incidents
        }


        print(
            "Prediction completed successfully."
        )


        return jsonify(result)


    except Exception as e:

        print("ERROR:", str(e))

        return jsonify({


            "error":
                "ML prediction failed",

            "message":
                str(e)

        }), 500


# =========================================================
# TRAINING DATA INGESTION
# =========================================================

@app.route("/training-data", methods=["POST"])
def add_training_data():
    global historical_data, historical_vectors, similarity_vectorizer
    try:
        data = request.get_json(silent=True) or {}
        description = data.get("description", "").strip()
        category = data.get("category", "").strip()
        root_cause = data.get("rootCause", data.get("root_cause", "")).strip()

        import csv
        with open(DATA_PATH, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f, quoting=csv.QUOTE_ALL)
            writer.writerow([description, category, root_cause])

        new_row = pd.DataFrame([{
            "description": description,
            "category": category,
            "root_cause": root_cause
        }])

        # Update in-memory historical data and similarity vectors
        historical_data = pd.concat([historical_data, new_row], ignore_index=True)
        historical_vectors = similarity_vectorizer.fit_transform(historical_data["description"].fillna(""))


        print(f"[ML] Training example appended. Total dataset size: {len(historical_data)}")

        return jsonify({
            "status": "SAVED",
            "totalSamples": len(historical_data),
            "message": "Training example appended to dataset successfully."
        })

    except Exception as e:
        print("[ML ERROR] Failed to save training data:", str(e))
        return jsonify({"error": "Failed to save training data", "message": str(e)}), 500


# =========================================================
# EXPLICIT MODEL RETRAINING (Admin Operation)
# =========================================================

@app.route("/retrain", methods=["POST"])
def retrain_model():
    global model, historical_data, historical_vectors, similarity_vectorizer
    try:
        from sklearn.pipeline import Pipeline
        from sklearn.svm import SVC
        import datetime

        print("[ML] Starting explicit model retraining...")
        df = pd.read_csv(DATA_PATH)
        df["description"] = df["description"].fillna("")
        df["category"] = df["category"].fillna("Unknown")

        X = df["description"]
        y = df["category"]

        new_model = Pipeline([
            ("tfidf", TfidfVectorizer(lowercase=True, stop_words="english", ngram_range=(1, 2))),
            ("svm", SVC(probability=True, kernel="linear"))
        ])

        new_model.fit(X, y)

        # Versioned backup
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        versioned_path = os.path.join(BASE_DIR, "model", f"incident_classifier_{timestamp}.pkl")
        joblib.dump(new_model, versioned_path)

        # Save as active model
        joblib.dump(new_model, MODEL_PATH)

        # Reload in memory
        model = new_model
        historical_data = df
        historical_vectors = similarity_vectorizer.fit_transform(historical_data["description"].fillna(""))

        classes = list(model.classes_)
        print(f"[ML] Model retrained successfully with {len(df)} samples across {len(classes)} classes.")

        return jsonify({
            "status": "RETRAINED",
            "samplesCount": len(df),
            "classes": classes,
            "modelBackup": f"incident_classifier_{timestamp}.pkl",
            "message": "Model retrained and active model reloaded successfully."
        })

    except Exception as e:
        print("[ML ERROR] Retraining failed:", str(e))
        return jsonify({"error": "Retraining failed", "message": str(e)}), 500



# =========================================================
# START SERVER
# =========================================================

if __name__ == "__main__":

    print("")
    print("==========================================")
    print(" SecureOps ML Service")
    print("==========================================")
    print("Starting Flask server...")
    print("Health:  http://127.0.0.1:5000/health")
    print("Predict: http://127.0.0.1:5000/predict")
    print("==========================================")
    print("")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False,
        use_reloader=False
    )
