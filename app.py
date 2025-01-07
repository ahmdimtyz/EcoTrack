from flask import Flask, jsonify
import pandas as pd
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

@app.route('/')
def home():
    return "Flask is running! Welcome to EcoTrack Insights."

@app.route('/predict', methods=['POST', 'GET'])
def predict():
    try:
        # Load live data
        live_log_path = 'custom-data.json'
        live_data = pd.read_json(live_log_path)

        # Extract weekly and daily data
        live_data['ts'] = pd.to_datetime(live_data['ts'], unit='ms')
        live_data['Month'] = live_data['ts'].dt.month
        live_data['Week'] = live_data['ts'].dt.isocalendar().week
        live_data['Weekday'] = live_data['ts'].dt.day_name()

        # Filter data for the latest month
        latest_month = live_data['Month'].max()
        latest_month_data = live_data[live_data['Month'] == latest_month]

        # Calculate weekly averages for the latest month
        weekly_avg = latest_month_data.groupby('Week')['pw'].mean().reset_index()

        # Sort by week and select the latest 4 weeks
        latest_4_weeks = weekly_avg.tail(4)
        latest_4_weeks['Week'] = latest_4_weeks['Week'].astype(int)
        latest_4_weeks['pw'] = latest_4_weeks['pw'].astype(float)

        # Train a model using the latest 4 weeks
        X_week = latest_4_weeks[['Week']]
        y_week = latest_4_weeks['pw']
        weekly_model = LinearRegression()
        weekly_model.fit(X_week, y_week)

        # Predict the next week's usage
        next_week = {'Week': [latest_4_weeks['Week'].iloc[-1] + 1]}  # Increment the last week by 1
        next_week_df = pd.DataFrame(next_week)
        next_week_prediction = weekly_model.predict(next_week_df)[0]

        # Calculate daily averages for Sunday to Wednesday
        latest_days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday']
        daily_data = live_data[live_data['Weekday'].isin(latest_days)]
        daily_avg = daily_data.groupby('Weekday')['pw'].mean().reindex(latest_days).reset_index()

        daily_avg['pw'] = daily_avg['pw'].astype(float)

        # Existing monthly averages and next month prediction logic
        monthly_avg = live_data.groupby('Month')['pw'].mean().reset_index()
        X_month = monthly_avg[['Month']]
        y_month = monthly_avg['pw']
        monthly_model = LinearRegression()
        monthly_model.fit(X_month, y_month)
        next_month = pd.DataFrame({'Month': [13]})
        next_month_prediction = monthly_model.predict(next_month)[0]

        # Recommendation logic
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
                return "High usage. Reduce unnecessary use!"
            elif usage < 40:
                return "Very High usage. Significant reduction needed!"
            else:
                return "Critical usage. Immediate action required!"

        recommendations = [
            {
                "Month": int(row['Month']),
                "usage": round(row['pw'], 2),
                "recommendation": get_recommendation(row['pw']),
            }
            for _, row in monthly_avg.iterrows()
        ]

        next_month_recommendation = get_recommendation(next_month_prediction)

        # Return data
        return jsonify({
            "monthly_usage": recommendations,
            "next_month_prediction": {
                "month": 13,
                "usage": round(next_month_prediction, 2),
                "recommendation": next_month_recommendation
            },
            "weekly_usage": latest_4_weeks.to_dict(orient='records'),
            "next_week_prediction": {
                "week": int(next_week['Week'][0]),
                "usage": round(next_week_prediction, 2)
            },
            "daily_usage": daily_avg.to_dict(orient='records')  # Add daily data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)