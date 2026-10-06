from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os

# ------------------------------
# Initialize FastAPI app
# ------------------------------
app = FastAPI(
    title="Mental Health Treatment Prediction API",
    description="API for predicting mental health treatment needs",
    version="1.0.0"
)

# ------------------------------
# CORS Configuration (Fixed)
# ------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)  #  Fixed: Added missing closing parenthesis

# ------------------------------
# Load Model, Scaler, and Columns
# ------------------------------
model, scaler, columns = None, None, None

try:
    model = joblib.load("treatment_prediction_model.pkl")
    scaler = joblib.load("scaler.pkl")
    columns = joblib.load("columns.pkl")
    print("Model, Scaler, and Columns loaded successfully.")
except FileNotFoundError as e:
    print(f" Model file not found: {e}")
    print(" Make sure .pkl files are in the same directory as main.py")
except Exception as e:
    print(f" Error loading model/scaler/columns: {e}")

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
    """
    Converts probability to a human-readable mental health score.
    
    Args:
        prob: Probability value between 0 and 1
        
    Returns:
        Formatted string with score and interpretation
    """
    score = int(prob * 100)
    if score < 40:
        return f"Score: {score} — You seem mentally healthy"
    elif score < 70:
        return f"Score: {score} — Moderate stress, stay mindful "
    else:
        return f"Score: {score} — High stress, consider seeking support"

# ------------------------------
# Health Check Endpoint
# ------------------------------
@app.get("/health")
def health_check():
    """
    Health check endpoint for monitoring service status.
    """
    model_status = "loaded" if model is not None else "not loaded"
    scaler_status = "loaded" if scaler is not None else "not loaded"
    columns_status = "loaded" if columns is not None else "not loaded"
    
    return {
        "status": "healthy",
        "model": model_status,
        "scaler": scaler_status,
        "columns": columns_status
    }

# ------------------------------
# Root Endpoint
# ------------------------------
@app.get("/")
def home():
    """
    Root endpoint with API information.
    """
    return {
        "message": "Welcome to the Mental Health Treatment Prediction API!",
        "usage": "Use the /predict endpoint or visit /docs for testing.",
        "endpoints": {
            "prediction": "/predict (POST)",
            "documentation": "/docs",
            "health_check": "/health"
        }
    }  #  Fixed: Added missing closing brace

# ------------------------------
# Prediction Endpoint
# ------------------------------
@app.post("/predict")
def predict(data: InputData):
    """
    Predicts mental health treatment needs based on input features.
    
    Args:
        data: InputData model containing all required features
        
    Returns:
        JSON response with prediction, probability, and interpretation
    """
    try:
        # Check if model components are loaded
        if model is None or scaler is None or columns is None:
            raise HTTPException(
                status_code=503,
                detail="Model not loaded. Please contact the administrator."
            )
        
        # Convert input to DataFrame (Fixed for Pydantic v2)
        df = pd.DataFrame([data.model_dump()])  # ✅ Fixed: Changed from data.dict()
        
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
        result = "Yes, treatment likely needed" if pred == 1 else "No, treatment may not be needed"
        score_text = mental_health_score(prob)
        
        return {
            "success": True,
            "prediction": result,
            "probability": round(prob, 3),
            "score_text": score_text
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f" Prediction error: {str(e)}")  # Log to Render console
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

# ------------------------------
# Run app (Render compatible)
# ------------------------------
if __name__ == "__main__":
    import uvicorn
    
    # Render sets the PORT environment variable dynamically
    port = int(os.getenv("PORT", 10000))
    
    print(f" Starting server on 0.0.0.0:{port}")
    
    # Critical for Render: Must bind to 0.0.0.0 and use PORT env variable
    uvicorn.run(
        "main:app",  #  Changed from 'app' to "main:app" for better compatibility
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
