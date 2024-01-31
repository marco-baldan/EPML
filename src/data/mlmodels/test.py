import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression


# Load the data
file_path = 'results_2019-20.json'
df = pd.read_json(file_path)

# Preprocessing
# Convert 'DateTime' to numerical features (e.g., month, day)
df['DateTime'] = pd.to_datetime(df['DateTime'])
df['Month'] = df['DateTime'].dt.month
df['DayOfWeek'] = df['DateTime'].dt.dayofweek
df.drop(['DateTime'], axis=1, inplace=True)

# Encode categorical variables
categorical_columns = ['Season', 'HomeTeam', 'AwayTeam', 'FTR', 'HTR', 'Referee']
for column in categorical_columns:
    df[column] = LabelEncoder().fit_transform(df[column])

# Feature Selection (Optional: based on domain knowledge)
# features = ['selected', 'features', 'here']
# X = df[features]

X = df.drop('FTR', axis=1)  # Features
y = df['FTR']  # Target

# Standardize features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Splitting the data
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.3, random_state=42, stratify=y)

# Naive Bayes Model
nb_classifier = GaussianNB()
nb_classifier.fit(X_train, y_train)
nb_predictions = nb_classifier.predict(X_test)
nb_accuracy = accuracy_score(y_test, nb_predictions)
print("Naive Bayes Accuracy:", nb_accuracy)

# SVM Model with Cross-Validation
svm_classifier = SVC(kernel='linear')
svm_accuracy = cross_val_score(svm_classifier, X_scaled, y, cv=StratifiedKFold(5)).mean()
print("SVM Accuracy (Cross-Validated):", svm_accuracy)

# Confusion Matrix for SVM
svm_classifier.fit(X_train, y_train)
svm_predictions = svm_classifier.predict(X_test)
conf_matrix = confusion_matrix(y_test, svm_predictions)
print("Confusion Matrix for SVM:\n", conf_matrix)
# ... [previous code for data loading and preprocessing] ...

# K-Nearest Neighbors Model
knn_classifier = KNeighborsClassifier(n_neighbors=5)
knn_classifier.fit(X_train, y_train)
knn_predictions = knn_classifier.predict(X_test)
knn_accuracy = accuracy_score(y_test, knn_predictions)
print("\nK-Nearest Neighbors Accuracy:", knn_accuracy)

# Logistic Regression Model
lr_classifier = LogisticRegression(max_iter=1000)  # Increased max_iter for convergence
lr_classifier.fit(X_train, y_train)
lr_predictions = lr_classifier.predict(X_test)
lr_accuracy = accuracy_score(y_test, lr_predictions)
print("\nLogistic Regression Accuracy:", lr_accuracy)
def cross_validate_model(model, X, y, cv=5):
    scores = cross_val_score(model, X, y, cv=cv)
    print(f"Accuracy (Cross-Validated): {scores.mean():.4f} ± {scores.std():.4f}")

# Naive Bayes Model with Cross-Validation
print("\nNaive Bayes Model:")
cross_validate_model(GaussianNB(), X_scaled, y)

# SVM Model with Cross-Validation
print("\nSVM Model with RBF Kernel:")
cross_validate_model(SVC(kernel='rbf'), X_scaled, y)

# K-Nearest Neighbors Model with Cross-Validation
print("\nK-Nearest Neighbors Model:")
cross_validate_model(KNeighborsClassifier(n_neighbors=5), X_scaled, y)

# Logistic Regression Model with Cross-Validation
print("\nLogistic Regression Model:")
cross_validate_model(LogisticRegression(max_iter=1000), X_scaled, y)