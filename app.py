from flask import Flask, request, jsonify
import joblib
import pandas as pd

# Load your model and other files
model = joblib.load("treatment_prediction_model.pkl")  
scaler = joblib.load("scaler.pkl")                      
columns = joblib.load("columns.pkl")                   

app = Flask(__name__)

@app.route('/')
def home():
    return "Mental Health Treatment Prediction API is working!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        df = pd.DataFrame([data])
        df = df.reindex(columns=columns, fill_value=0)
        df_scaled = scaler.transform(df)
        prediction = model.predict(df_scaled)[0]
        result = "Needs treatment" if prediction == 1 else "Does not need treatment"
        return jsonify({"prediction": int(prediction), "result": result})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000, debug=True)
