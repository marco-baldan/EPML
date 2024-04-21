"""This module performs predictions using various machine learning models on football match 
data, using vadar Sentiment Analysis as a feature."""
import json
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.naive_bayes import GaussianNB
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.model_selection import GridSearchCV
import warnings
warnings.filterwarnings("ignore", message="X does not have valid feature names")
warnings.filterwarnings("ignore", message=".*Scoring failed.*")

# pylint: disable=E1101

# Load data
FILE_PATH = 'results_2019-20_with_sentiment.json'
df = pd.read_json(FILE_PATH)

# Feature Engineering
df['DateTime'] = pd.to_datetime(df['DateTime'])
df['Month'] = df['DateTime'].dt.month
df['DayOfWeek'] = df['DateTime'].dt.dayofweek

# Define Features
features = [
    'HomeTeam', 'AwayTeam', 'Referee', 'HS', 'AS', 'HST', 'AST', 
    'HC', 'AC', 'HF', 'AF', 'HY', 'AY', 'HR'
]

vadar_cols = ['HomeTeamScoreVadar', 'AwayTeamScoreVadar']
features.extend(col for col in vadar_cols if col in df.columns)

X = df[features]
y = df['FTR']

# Data Preprocessing
for column in ['HomeTeam', 'AwayTeam', 'Referee']:
    le = LabelEncoder()
    X[column] = le.fit_transform(X[column])

X.dropna(inplace=True)
y = df.loc[X.index, 'FTR']

# Train Test Split
train_size = int(len(X) * 0.61)
X_train, X_test = X.iloc[:train_size], X.iloc[train_size:]
y_train, y_test = y.iloc[:train_size], y.iloc[train_size:]

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Naive Bayes
print("# Naive Bayes")
param_grid_nb = {
    'var_smoothing': [1e-9, 1e-8, 1e-7, 1e-6, 1e-5, 1e-4, 1e-3, 1e-2, 1e-1]
}

nb_classifier = GaussianNB()
nb_classifier.fit(X_train_scaled, y_train)

grid_search_nb = GridSearchCV(nb_classifier, param_grid_nb, cv=5, scoring='accuracy')
grid_search_nb.fit(X_train_scaled, y_train)

best_nb_classifier = grid_search_nb.best_estimator_

nb_predictions = best_nb_classifier.predict(X_test_scaled)

nb_accuracy = accuracy_score(y_test, nb_predictions)
print("Accuracy:", nb_accuracy)

nb_precision = precision_score(y_test, nb_predictions, average='weighted')
print("Precision:", nb_precision)

nb_recall = recall_score(y_test, nb_predictions, average='weighted')
print("Recall:", nb_recall)

nb_f1 = f1_score(y_test, nb_predictions, average='weighted')
print("F1 Score:", nb_f1)

# Logistic Regression
print("# Logistic Regression")
param_grid = {
    'C': [0.001, 0.01, 0.1, 1, 10, 100],
    'penalty': ['l1', 'l2'],
    'class_weight': [None, 'balanced'],
    'solver': ['liblinear', 'saga'],
    'max_iter': [1000, 2000],
}
lr = LogisticRegression()
grid_search = GridSearchCV(lr, param_grid, cv=5, scoring='accuracy')
grid_search.fit(X_train_scaled, y_train)
lr = LogisticRegression(max_iter=1000, solver='liblinear')
best_lr = grid_search.best_estimator_
best_lr.fit(X_train_scaled, y_train)

lr_predictions = best_lr.predict(X_test_scaled)

lr_accuracy = accuracy_score(y_test, lr_predictions)
print("Accuracy:", lr_accuracy)

lr_precision = precision_score(y_test, lr_predictions, average='weighted')
print("Precision:", lr_precision)

lr_recall = recall_score(y_test, lr_predictions, average='weighted')
print("Recall:", lr_recall)

lr_f1 = f1_score(y_test, lr_predictions, average='weighted')
print("F1 Score:", lr_f1)

# K-Nearest Neighbors
print("# K-Nearest Neighbors")
knn_param_grid = {
    'n_neighbors': [3, 5, 7, 9, 11],
    'weights': ['uniform', 'distance'],
    'metric': ['euclidean', 'manhattan', 'chebyshev', 'minkowski'],
    'algorithm': ['auto', 'ball_tree', 'kd_tree', 'brute'],
    'leaf_size': [20, 30, 40],
}

knn_grid_search = GridSearchCV(KNeighborsClassifier(), knn_param_grid, cv=5, scoring='accuracy')
knn_grid_search.fit(X_train_scaled, y_train)
best_knn = knn_grid_search.best_estimator_
best_knn.fit(X_train_scaled, y_train)
knn_predictions = best_knn.predict(X_test_scaled)

knn_accuracy = accuracy_score(y_test, knn_predictions)
print("Accuracy:", knn_accuracy)

knn_precision = precision_score(y_test, knn_predictions, average='weighted')
print("Precision:", knn_precision)

knn_recall = recall_score(y_test, knn_predictions, average='weighted')
print("Recall:", knn_recall)

knn_f1 = f1_score(y_test, knn_predictions, average='weighted')
print("F1 Score:", knn_f1)

# Support Vector Machine
print("# Support Vector Machine")
svm_param_grid = {
    'C': [0.001, 0.01, 0.1, 1, 10, 100],
    'kernel': ['rbf'],
    'gamma': ['scale', 'auto'],
}
svm_grid_search = GridSearchCV(SVC(), svm_param_grid, cv=5, scoring='accuracy')
svm_grid_search.fit(X_train_scaled, y_train)
best_svm = svm_grid_search.best_estimator_
best_svm.fit(X_train_scaled, y_train)

svm_predictions = best_svm.predict(X_test_scaled)

svm_accuracy = accuracy_score(y_test, svm_predictions)
print("Accuracy:", svm_accuracy)

svm_precision = precision_score(y_test, svm_predictions, average='weighted')
print("Precision:", svm_precision)

svm_recall = recall_score(y_test, svm_predictions, average='weighted')
print("Recall:", svm_recall)

svm_f1 = f1_score(y_test, svm_predictions, average='weighted')
print("F1 Score:", svm_f1)

team_encoder = LabelEncoder().fit(df['HomeTeam'])
team_mapping = {index: label for index, label in enumerate(team_encoder.classes_)}
def collect_predictions(X_data, y_data, nb_model, lr_model, knn_model, svm_model, scaler):
    game_details = []

    for i in range(len(X_data)):
        game_unscaled = X_data.iloc[i]
        game_scaled = scaler.transform([game_unscaled.values])

        nb_pred = nb_model.predict(game_scaled)[0]
        lr_pred = lr_model.predict(game_scaled)[0]
        knn_pred = knn_model.predict(game_scaled)[0]
        svm_pred = svm_model.predict(game_scaled)[0]

        home_team = team_mapping[game_unscaled['HomeTeam']]
        away_team = team_mapping[game_unscaled['AwayTeam']]

        if i < len(y_data):
            actual_result = y_data.iloc[i]
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
        else:
            actual_result = "Unknown"
            correct_models_str = "Data mismatch"

        game_details.append({
            "Game": f"{home_team} vs {away_team}",
            "vadar Naive Bayes": nb_pred,
            "vadar L Regress": lr_pred,
            "vadar KNN": knn_pred,
            "vadar SVM": svm_pred,
        })

    return game_details
# Collect predictions
game_predictions = collect_predictions(X_test, y_test, nb_classifier, 
                                       best_lr, best_knn, best_svm, scaler)

# Save the results to a JSON file
OUTPUT_FILE = 'predictions_results_with_vadar.json'
with open(OUTPUT_FILE, 'w') as f:
    json.dump(game_predictions, f)

print("Predictions results saved to:", OUTPUT_FILE)

metrics_dict = {
    "Naive Bayes": {
        "Accuracy": nb_accuracy,
        "Precision": nb_precision,
        "Recall": nb_recall,
        "F1 Score": nb_f1
    },
    "Logistic Regression": {
        "Accuracy": lr_accuracy,
        "Precision": lr_precision,
        "Recall": lr_recall,
        "F1 Score": lr_f1
    },
    "K-Nearest Neighbors": {
        "Accuracy": knn_accuracy,
        "Precision": knn_precision,
        "Recall": knn_recall,
        "F1 Score": knn_f1
    },
    "Support Vector Machine": {
        "Accuracy": svm_accuracy,
        "Precision": svm_precision,
        "Recall": svm_recall,
        "F1 Score": svm_f1
    }
}

METRICS_OUTPUT_FILE = 'metrics_results_vader.json'
with open(METRICS_OUTPUT_FILE, 'w') as f:
    json.dump(metrics_dict, f, indent=4)

print("Metrics results saved to:", METRICS_OUTPUT_FILE)