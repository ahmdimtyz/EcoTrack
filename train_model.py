import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import pickle

# Load dataset
dataset = pd.read_csv('data/electricity_bill_dataset.csv')

# Use first 6 months of data for training
train_data = dataset[dataset['Month'] <= 6]

# Extract features and target
X_train = train_data[['AirConditioner', 'Television']]
y_train = train_data['MonthlyHours']  # Replace 'Usage' with the actual target column in your dataset

# Train a Linear Regression model
model = LinearRegression()
model.fit(X_train, y_train)

# Save the trained model
model_path = 'models/linear_regression_model.pkl'
with open(model_path, 'wb') as file:
    pickle.dump(model, file)

print(f"Model trained on {len(train_data)} rows and saved to {model_path}")
