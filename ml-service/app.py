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

        print(
            "ERROR:",
            str(e)
        )

        return jsonify({

            "error":
                "ML prediction failed",

            "message":
                str(e)

        }), 500


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
