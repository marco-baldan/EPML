import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score
from sklearn.naive_bayes import GaussianNB
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split, GridSearchCV

# Load the data
file_path = 'results_2019-20_with_sentiment.json'  # Adjust to your correct file path
df = pd.read_json(file_path)

# Preprocessing
df['DateTime'] = pd.to_datetime(df['DateTime'])
df['Month'] = df['DateTime'].dt.month
df['DayOfWeek'] = df['DateTime'].dt.dayofweek
df.fillna({'HomeTeamScoreVader': 0, 'AwayTeamScoreVader': 0}, inplace=True)

def prepare_data(include_sentiment=False):
    features = [
        'HomeTeam', 'AwayTeam', 'Referee', 'HS', 'AS', 'HST', 'AST',
        'HC', 'AC', 'HF', 'AF', 'HY', 'AY', 'HR', 'AR', 'Month', 'DayOfWeek'
    ]
    if include_sentiment:
        features.extend(['HomeTeamScoreVader', 'AwayTeamScoreVader'])
    
    X = df[features]
    for column in ['HomeTeam', 'AwayTeam', 'Referee']:
        le = LabelEncoder()
        X[column] = le.fit_transform(X[column])
    
    y = df['FTR']
    return X, y

# Split and scale data
def split_and_scale(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    return X_train_scaled, X_test_scaled, y_train, y_test

# Initialize and train models
def train_models(X_train_scaled, y_train):
    models = {
        'GaussianNB': GaussianNB(),
        'KNN': KNeighborsClassifier(),
        'SVM': SVC(),
    }
    param_grid = {'C': [0.001, 0.01, 0.1, 1, 10, 100], 'penalty': ['l1', 'l2']}
    lr = LogisticRegression(max_iter=1000, solver='liblinear')
    grid_search = GridSearchCV(lr, param_grid, cv=5, scoring='accuracy')
    grid_search.fit(X_train_scaled, y_train)
    models['LogisticRegression'] = grid_search.best_estimator_
    
    for name, model in models.items():
        model.fit(X_train_scaled, y_train)
    
    return models

# Evaluate models
def evaluate_models(models, X_test_scaled, y_test, team_mapping, X_test):
    game_details = []
    
    for index, (scaled_features, actual) in enumerate(zip(X_test_scaled, y_test)):
        predictions = {f"{name}_Prediction": model.predict([scaled_features])[0] for name, model in models.items()}
        
        # Decode team names using the original (unscaled) test data
        home_team = team_mapping[X_test.iloc[index]['HomeTeam']]
        away_team = team_mapping[X_test.iloc[index]['AwayTeam']]
        
        game_info = {
            "Game": f"{home_team} vs {away_team}",
            "Actual": actual,
            **predictions
        }
        game_details.append(game_info)
    
    # Convert game details into a DataFrame for nicer display
    games_df = pd.DataFrame(game_details)
    print(games_df.to_string(index=False))  # Print the DataFrame without the index
    
    # Calculate and print accuracies
    accuracies = {}
    print("\nModel Accuracies:")
    for name in models.keys():
        accuracies[name] = games_df.apply(lambda row: row['Actual'] == row[f'{name}_Prediction'], axis=1).mean()
        print(f"{name}: {accuracies[name]:.4f}")


# Team mapping for decoding team names
team_encoder = LabelEncoder().fit(df['HomeTeam'])
team_mapping = {index: label for index, label in enumerate(team_encoder.classes_)}

# Assuming the models are trained and the data is prepared

# Experiment without VADER scores
print("Experiment without VADER Scores")
X, y = prepare_data(include_sentiment=False)
X_train_scaled, X_test_scaled, y_train, y_test = split_and_scale(X, y)
models = train_models(X_train_scaled, y_train)
evaluate_models(models, X_test_scaled, y_test, team_mapping, X.iloc[y_test.index])

# Experiment with VADER scores
print("\nExperiment with VADER Scores")
X, y = prepare_data(include_sentiment=True)
X_train_scaled, X_test_scaled, y_train, y_test = split_and_scale(X, y)
models = train_models(X_train_scaled, y_train)
evaluate_models(models, X_test_scaled, y_test, team_mapping, X.iloc[y_test.index])
