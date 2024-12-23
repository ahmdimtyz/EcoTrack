from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

# Load the trained model
model_path = 'models/linear_regression_model.pkl'
with open(model_path, 'rb') as model_file:
    model = pickle.load(model_file)

# Load the dataset
dataset_path = 'data/electricity_bill_dataset.csv'
dataset = pd.read_csv(dataset_path)

@app.route('/')
def home():
    return "Flask is running! Welcome to EcoTrack Insights."

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Prepare data for months 7–12
        avg_air_conditioner = dataset[dataset['Month'] <= 6]['AirConditioner'].mean()
        avg_television = dataset[dataset['Month'] <= 6]['Television'].mean()

        future_data = pd.DataFrame({
            'Month': [7, 8, 9, 10, 11, 12],
            'AirConditioner': [avg_air_conditioner] * 6,
            'Television': [avg_television] * 6
        })

        # Predict usage for months 7–12
        predictions = model.predict(future_data[['AirConditioner', 'Television']])

        # Recommendation logic
        def get_recommendation(usage):
            if usage < 400:
                return "Very Low usage. Great efficiency!"
            elif usage < 500:
                return "Low usage. Keep it up!"
            elif usage < 600:
                return "Moderate usage. Consider optimizing."
            elif usage < 700:
                return "High usage. Reduce unnecessary use."
            else:
                return "Very High usage. Immediate action required!"

        # Generate recommendations for each month
        recommendations = [
            {
                'month': month,
                'air_conditioner': get_recommendation(predictions[i]),
                'television': get_recommendation(predictions[i]),
            }
            for i, month in enumerate(future_data['Month'])
        ]

        # Return predictions and recommendations as JSON
        return jsonify({
            'months': future_data['Month'].tolist(),
            'predictions': predictions.tolist(),
            'recommendations': recommendations
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
if __name__ == '__main__':
    app.run(debug=True)