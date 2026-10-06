from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import joblib
import os

# ============================================================================
# STUDENT STRESS PREDICTION API - INDIVIDUAL PREDICTIONS ONLY
# ============================================================================

app = FastAPI(
    title="Student Stress Prediction API",
    description="Predicts individual student stress levels from quiz responses",
    version="1.0.0"
)

# ============================================================================
# CORS - Allow Frontend to Call API
# ============================================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# LOAD MODEL FILES
# ============================================================================

model, scaler, columns = None, None, None

try:
    # Load from models folder
    model = joblib.load("models/student_stress_rf_model.pkl")
    scaler = joblib.load("models/student_scaler.pkl")
    columns = joblib.load("models/student_columns.pkl")
    print("Model loaded successfully!")
    print(f"Features: {len(columns)}")
except FileNotFoundError as e:
    print(f" Error loading model: {e}")
    print("  Make sure .pkl files are in 'models/' folder")

# ============================================================================
# INPUT SCHEMA (Quiz Answers)
# ============================================================================

class StudentInput(BaseModel):
    """20 features from student quiz"""
    anxiety_level: int = Field(..., ge=0, le=30, description="Anxiety level (0-30)")
    self_esteem: int = Field(..., ge=0, le=30, description="Self-esteem (0-30)")
    mental_health_history: int = Field(..., ge=0, le=1, description="0=No, 1=Yes")
    depression: int = Field(..., ge=0, le=30, description="Depression level (0-30)")
    headache: int = Field(..., ge=0, le=5, description="Headache frequency (0-5)")
    blood_pressure: int = Field(..., ge=1, le=3, description="1=Low, 2=Normal, 3=High")
    sleep_quality: int = Field(..., ge=0, le=5, description="0=Poor, 5=Excellent")
    breathing_problem: int = Field(..., ge=0, le=5, description="Breathing issues (0-5)")
    noise_level: int = Field(..., ge=0, le=5, description="Environmental noise (0-5)")
    living_conditions: int = Field(..., ge=1, le=5, description="1=Poor, 5=Excellent")
    safety: int = Field(..., ge=1, le=5, description="Safety perception (1-5)")
    basic_needs: int = Field(..., ge=1, le=5, description="Basic needs met (1-5)")
    academic_performance: int = Field(..., ge=1, le=5, description="Academic performance (1-5)")
    study_load: int = Field(..., ge=1, le=5, description="Study load (1-5)")
    teacher_student_relationship: int = Field(..., ge=1, le=5, description="Teacher relationship (1-5)")
    future_career_concerns: int = Field(..., ge=1, le=5, description="Career concerns (1-5)")
    social_support: int = Field(..., ge=0, le=3, description="Social support (0-3)")
    peer_pressure: int = Field(..., ge=0, le=5, description="Peer pressure (0-5)")
    extracurricular_activities: int = Field(..., ge=0, le=5, description="Extracurricular (0-5)")
    bullying: int = Field(..., ge=0, le=5, description="Bullying experience (0-5)")

    class Config:
        json_schema_extra = {
            "example": {
                "anxiety_level": 14, "self_esteem": 20, "mental_health_history": 0,
                "depression": 11, "headache": 2, "blood_pressure": 1,
                "sleep_quality": 2, "breathing_problem": 4, "noise_level": 2,
                "living_conditions": 3, "safety": 3, "basic_needs": 2,
                "academic_performance": 3, "study_load": 2,
                "teacher_student_relationship": 3, "future_career_concerns": 3,
                "social_support": 2, "peer_pressure": 3,
                "extracurricular_activities": 3, "bullying": 2
            }
        }

# ============================================================================
# OUTPUT SCHEMA (Prediction Result)
# ============================================================================

class PredictionOutput(BaseModel):
    """What the API returns"""
    success: bool
    prediction: int
    stress_level: str
    confidence: dict
    stress_score: float
    recommendation: str

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_stress_label(prediction: int) -> str:
    """Convert 0/1/2 to text"""
    labels = {
        0: "Low Stress",
        1: "Moderate Stress",
        2: "High Stress"
    }
    return labels.get(prediction, "Unknown")

def get_recommendation(prediction: int) -> str:
    """Generate advice based on prediction"""
    if prediction == 0:
        return "Great! Your stress levels are low. Keep maintaining healthy habits and routines."
    elif prediction == 1:
        return "Your stress levels are moderate. Consider stress management techniques, regular exercise, and speaking with a counselor if needed."
    else:
        return "Your stress levels are high. We strongly recommend reaching out to a mental health professional, counselor, or trusted adult for support."

def calculate_stress_score(probabilities: list) -> float:
    """Calculate continuous score (0-100)"""
    # Low=0, Moderate=50, High=100
    return round(probabilities[0] * 0 + probabilities[1] * 50 + probabilities[2] * 100, 2)

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/")
def home():
    """API home page"""
    return {
        "message": "Student Stress Prediction API",
        "version": "1.0.0",
        "status": "active",
        "purpose": "Individual student stress prediction from quiz",
        "model_accuracy": "89%",
        "endpoints": {
            "predict": "/predict - Predict ONE student stress level",
            "health": "/health - Check API health",
            "info": "/model/info - Get model details",
            "docs": "/docs - Interactive documentation"
        }
    }

@app.get("/health")
def health_check():
    """Check if model is loaded and ready"""
    return {
        "status": "healthy" if model is not None else "unhealthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None,
        "columns_loaded": columns is not None,
        "total_features": len(columns) if columns else 0
    }

@app.post("/predict", response_model=PredictionOutput)
def predict_stress(student: StudentInput):
    """
    MAIN ENDPOINT: Predict stress for ONE student
    
    This is what your backend calls when a student submits the quiz!
    """
    try:
        # Check model is loaded
        if model is None or scaler is None or columns is None:
            raise HTTPException(
                status_code=500,
                detail="Model not loaded. Check that .pkl files are in models/ folder"
            )
        
        # Convert input to DataFrame
        input_dict = student.dict()
        df = pd.DataFrame([input_dict])
        
        # Ensure correct column order (important!)
        df = df[columns]
        
        # Scale features (normalize data)
        X_scaled = scaler.transform(df)
        
        # Make prediction
        prediction = int(model.predict(X_scaled)[0])
        probabilities = model.predict_proba(X_scaled)[0]
        
        # Prepare confidence scores
        confidence = {
            "low": round(float(probabilities[0]), 4),
            "moderate": round(float(probabilities[1]), 4),
            "high": round(float(probabilities[2]), 4)
        }
        
        # Calculate stress score (0-100)
        stress_score = calculate_stress_score(probabilities)
        
        # Return result
        return PredictionOutput(
            success=True,
            prediction=prediction,
            stress_level=get_stress_label(prediction),
            confidence=confidence,
            stress_score=stress_score,
            recommendation=get_recommendation(prediction)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

@app.get("/model/info")
def model_info():
    """Get model information and feature list"""
    if columns is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    return {
        "model_type": "Random Forest Classifier",
        "accuracy": "89%",
        "n_estimators": 10,
        "total_features": len(columns),
        "features": columns,
        "target_classes": {
            0: "Low Stress",
            1: "Moderate Stress",
            2: "High Stress"
        },
        "training_samples": 1100,
        "purpose": "Individual student stress prediction"
    }

# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*70)
    print("STARTING STUDENT STRESS PREDICTION API")
    print("="*70)
    print(" Local URL: http://localhost:8000")
    print("📖 Docs: http://localhost:8000/docs")
    print("="*70 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
