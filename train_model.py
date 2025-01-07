import pandas as pd
from sklearn.linear_model import LinearRegression
import pickle
import json

# Load live dataset
live_dataset_path = 'custom-data.json'
live_dataset = pd.read_json(live_dataset_path)

# Preprocess live dataset
live_dataset['Timestamp'] = pd.to_datetime(live_dataset['ts'], unit='ms')
live_dataset['Month'] = live_dataset['Timestamp'].dt.month
live_dataset['Year'] = live_dataset['Timestamp'].dt.year

# Group by month and calculate average power usage
monthly_data = live_dataset.groupby(['Year', 'Month'])['pw'].mean().reset_index()
monthly_data['Month'] = monthly_data['Month'].astype(int)

# Use the last 12 months for training
last_year_data = monthly_data[-12:]

# Prepare features (X) and target (y)
X_train = last_year_data[['Month']]  # Use months as features (e.g., 1-12)
y_train = last_year_data['pw']       # Average power usage as the target

# Train the model
model = LinearRegression()
model.fit(X_train, y_train)

# Save the model
model_path = 'models/monthly_power_usage_model.pkl'
with open(model_path, 'wb') as file:
    pickle.dump(model, file)

print(f"Model trained on {len(X_train)} months and saved to {model_path}")

# Make prediction for the next month
next_month = pd.DataFrame({'Month': [(last_year_data['Month'].iloc[-1] % 12) + 1]})
predicted_usage = model.predict(next_month)

# Updated recommendation logic with 7 ranges
def get_recommendation(usage):
    if usage < 10:
        return "Extremely Low usage. Outstanding efficiency!"
    elif usage < 15:
        return "Very Low usage. Excellent efficiency!"
    elif usage < 20:
        return "Low usage. Great job!"
    elif usage < 25:
        return "Moderate usage. Consider optimizing."
    elif usage < 30:
        return "High usage. Reduce unnecessary use."
    elif usage < 40:
        return "Very High usage. Significant reduction needed!"
    else:
        return "Critical usage. Immediate action required!"


# Add recommendations to the data
last_year_data['recommendation'] = last_year_data['pw'].apply(get_recommendation)

# Add prediction with recommendation
next_month_data = {
    'Month': int(next_month['Month'].iloc[0]),
    'pw': float(predicted_usage[0]),
    'recommendation': get_recommendation(float(predicted_usage[0]))
}

# Save the monthly data and prediction to a JSON file for Flask API
output_data = {
    'monthly_usage': last_year_data.to_dict(orient='records'),
    'next_month_prediction': next_month_data
}

output_path = 'data/monthly_predictions.json'
with open(output_path, 'w') as json_file:
    json.dump(output_data, json_file, indent=4)

print(f"Monthly usage and prediction saved to {output_path}")
