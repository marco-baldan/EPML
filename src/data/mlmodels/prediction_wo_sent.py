import pandas as pd
import json
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score
from sklearn.naive_bayes import GaussianNB
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.model_selection import GridSearchCV

# Load the data
file_path = 'results_2019-20_with_sentiment.json'  # Make sure to use your correct file path
df = pd.read_json(file_path)

# Preprocessing
df['DateTime'] = pd.to_datetime(df['DateTime'])
df['Month'] = df['DateTime'].dt.month
df['DayOfWeek'] = df['DateTime'].dt.dayofweek

# Selecting relevant features
features = [
    'HomeTeam', 'AwayTeam', 'Referee', 'HS', 'AS', 'HST', 'AST', 
    'HC', 'AC', 'HF', 'AF', 'HY', 'AY', 'HR', 'AR', 'Month', 'DayOfWeek'
]
X = df[features]

# Encoding categorical variables
for column in ['HomeTeam', 'AwayTeam', 'Referee']:
    le = LabelEncoder()
    X.loc[:, column] = le.fit_transform(X[column])

# Target variable
y = df['FTR']

# Splitting the data based on time (first 70% training, last 30% testing)
train_size = int(len(df) * 0.7)
X_train, X_test = X.iloc[:train_size], X.iloc[train_size:]
y_train, y_test = y.iloc[:train_size], y.iloc[train_size:]

# Feature scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train.to_numpy())
X_test_scaled = scaler.transform(X_test.to_numpy())

# Initialize models
nb_classifier = GaussianNB()
nb_classifier.fit(X_train_scaled, y_train)
knn_classifier = KNeighborsClassifier()
svm_classifier = SVC()

# Hyperparameter tuning for Logistic Regression using GridSearchCV
param_grid = {
    'C': [0.001, 0.01, 0.1, 1, 10, 100],
    'penalty': ['l1', 'l2']
}
lr = LogisticRegression(max_iter=1000, solver='liblinear')
grid_search = GridSearchCV(lr, param_grid, cv=5, scoring='accuracy')
grid_search.fit(X_train_scaled, y_train)

# Best parameters and score
print("Best parameters for Logistic Regression:", grid_search.best_params_)
print("Best cross-validated score:", grid_search.best_score_)

# Retrain Logistic Regression with best parameters on the entire training set
best_lr = grid_search.best_estimator_
best_lr.fit(X_train_scaled, y_train)
knn_classifier.fit(X_train_scaled, y_train)
svm_classifier.fit(X_train_scaled, y_train)

# Team mapping for decoding team names
team_encoder = LabelEncoder().fit(df['HomeTeam'])
team_mapping = {index: label for index, label in enumerate(team_encoder.classes_)}

# Function to update models with new data
def update_model(model, X_new, y_new, is_lr=False):
    if is_lr:
        if len(set(y_new)) > 1:
            model.fit(X_new, y_new)
    else:
        model.partial_fit(X_new, y_new)

# Function to collect predictions and determine correctness
def collect_predictions(X_data, y_data, nb_model, lr_model, knn_model, svm_model, scaler):
    game_details = []

    for i in range(len(X_data)):
        game_unscaled = X_data.iloc[i]
        game_scaled = scaler.transform([game_unscaled.values])

        actual_result = y_data.iloc[i]
        nb_pred = nb_model.predict(game_scaled)[0]
        lr_pred = lr_model.predict(game_scaled)[0]
        knn_pred = knn_model.predict(game_scaled)[0]
        svm_pred = svm_model.predict(game_scaled)[0]

        home_team = team_mapping[game_unscaled['HomeTeam']]
        away_team = team_mapping[game_unscaled['AwayTeam']]

        correct_models = []
        if actual_result == nb_pred:
            correct_models.append("NB")
        if actual_result == lr_pred:
            correct_models.append("LR")
        if actual_result == knn_pred:
         correct_models.append("KNN")    
        if actual_result == svm_pred:
            correct_models.append("SVM")
        correct_models_str = ' and '.join(correct_models) if correct_models else "No"
        
        game_details.append({
            "Game": f"{home_team} vs {away_team}",
            "w/o Naive Bayes": nb_pred,
            "w/o L Regress": lr_pred,
            "w/o KNN": knn_pred,
            "w/o SVM": svm_pred,
        })

    return game_details

# Collect predictions
game_predictions = collect_predictions(X_test, y_test, nb_classifier, best_lr, knn_classifier, svm_classifier, scaler)

# Save the results to a JSON file
output_file = 'predictions_results_without_sent.json'
with open(output_file, 'w') as f:
    json.dump(game_predictions, f)

print("Predictions results saved to:", output_file)