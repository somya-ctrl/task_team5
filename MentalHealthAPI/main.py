from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
import os

# ------------------------------
# Initialize FastAPI app
# ------------------------------
app = FastAPI(title="Mental Health Treatment Prediction API")

# ------------------------------
# Load Model, Scaler, and Columns
# ------------------------------
model, scaler, columns = None, None, None

try:
    model = joblib.load("treatment_prediction_model.pkl")   # ✅ fixed filename
    scaler = joblib.load("scaler.pkl")
    columns = joblib.load("columns.pkl")
    print("✅ Model, Scaler, and Columns loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model/scaler/columns: {e}")


# ------------------------------
# Input Schema
# ------------------------------
class InputData(BaseModel):
    Age: int
    Gender: str
    Country: str
    self_employed: str
    family_history: str
    no_employees: str
    remote_work: str
    tech_company: str
    benefits: str
    care_options: str
    wellness_program: str
    seek_help: str
    anonymity: str
    mental_health_consequence: str
    phys_health_consequence: str
    coworkers: str
    supervisor: str
    mental_health_interview: str
    phys_health_interview: str
    mental_vs_physical: str
    obs_consequence: str


# ------------------------------
# Helper: Convert probability to readable score
# ------------------------------
def mental_health_score(prob: float) -> str:
    score = int(prob * 100)
    if score < 40:
        return f"Score: {score} — You seem mentally healthy 🙂"
    elif score < 70:
        return f"Score: {score} — Moderate stress, stay mindful 🧠"
    else:
        return f"Score: {score} — High stress, consider seeking support 💬"


# ------------------------------
# Root Endpoint
# ------------------------------
@app.get("/")
def home():
    return {
        "message": "Welcome to the Mental Health Treatment Prediction API!",
        "usage": "Use the /predict endpoint or visit /docs for testing."
    }


# ------------------------------
# Prediction Endpoint
# ------------------------------
@app.post("/predict")
def predict(data: InputData):
    try:
        if model is None or scaler is None or columns is None:
            return {"error": "Model or required files not loaded properly. Please check .pkl paths."}

        # Convert input to DataFrame
        df = pd.DataFrame([data.dict()])

        # Encode categorical columns
        df_encoded = pd.get_dummies(df)

        # Align columns with training set
        df_encoded = df_encoded.reindex(columns=columns, fill_value=0)

        # Scale numerical features
        df_scaled = scaler.transform(df_encoded)

        # Get prediction & probability
        prob = float(model.predict_proba(df_scaled)[0][1])
        pred = int(model.predict(df_scaled)[0])

        # Interpret result
        result = "Yes, treatment likely needed ❤️" if pred == 1 else "No, treatment may not be needed 🙂"
        score_text = mental_health_score(prob)

        return {
            "prediction": result,
            "probability": round(prob, 3),
            "score_text": score_text
        }

    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}


# ------------------------------
# Run app (for Render or local)
# ------------------------------
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))  # Render provides PORT automatically
    uvicorn.run("main:app", host="0.0.0.0", port=port)
