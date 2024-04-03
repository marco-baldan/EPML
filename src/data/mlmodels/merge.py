import json

def load_json(filename):
    """Load JSON data from a file."""
    with open(filename, 'r') as file:
        return json.load(file)

def match_game(results):
    """Construct the game string from results data."""
    return f"{results['HomeTeam']} vs {results['AwayTeam']}"

# Load data from JSON files
results_data = load_json('results_2019-20.json')
predictions_roberta = load_json('predictions_results_with_roberta.json')
predictions_vadar = load_json('predictions_results_with_vadar.json')
predictions_without_sent = load_json('predictions_results_without_sent.json')

# Convert results_data to a dictionary for easier matching
results_dict = {match_game(result): result for result in results_data}

# Initialize a list to store collated game data
collated_data = []

# Function to merge prediction results with actual results
def merge_predictions(game, predictions_list):
    """Merge predictions for a game from a list of prediction dictionaries."""
    for prediction in predictions_list:
        if prediction['Game'] == game:
            # Return a copy of the prediction dictionary without the 'Game' key
            # to prevent overwriting the 'Game' key in the final data.
            return {k: v for k, v in prediction.items() if k != 'Game'}
    return {}

# Now update the merging logic accordingly:
for game in results_dict:
    game_data = {"Game": game}
    # Update calls to merge_predictions to pass the list of dictionaries directly
    game_data.update(merge_predictions(game, predictions_roberta))
    game_data.update(merge_predictions(game, predictions_vadar))
    game_data.update(merge_predictions(game, predictions_without_sent))
    game_data.update(results_dict[game])  # Add actual results
    collated_data.append(game_data)

# Example: Outputting the first collated game data for review
print(collated_data[0])

# Optionally, save the collated data to a new JSON file
with open('collated_games_data.json', 'w') as outfile:
    json.dump(collated_data, outfile, indent=4)
