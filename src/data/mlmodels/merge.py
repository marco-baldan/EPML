import json

def load_json(filename):
    """Load JSON data from a file."""
    with open(filename, 'r') as file:
        return json.load(file)

def match_game(results):
    """Construct the game string from results data."""
    return f"{results['HomeTeam']} vs {results['AwayTeam']}"

results_data = load_json('results_2019-20.json')
predictions_roberta = load_json('predictions_results_with_roberta.json')
predictions_vadar = load_json('predictions_results_with_vadar.json')
predictions_without_sent = load_json('predictions_results_without_sent.json')

results_dict = {match_game(result): result for result in results_data}

collated_data = []

def merge_predictions(game, predictions_list):
    """Merge predictions for a game from a list of prediction dictionaries."""
    for prediction in predictions_list:
        if prediction['Game'] == game:
            return {k: v for k, v in prediction.items() if k != 'Game'}
    return {}

for game in results_dict:
    game_data = {"Game": game}
    game_data.update(merge_predictions(game, predictions_roberta))
    game_data.update(merge_predictions(game, predictions_vadar))
    game_data.update(merge_predictions(game, predictions_without_sent))
    game_data.update(results_dict[game])  
    collated_data.append(game_data)

print(collated_data[0])

with open('collated_games_data.json', 'w') as outfile:
    json.dump(collated_data, outfile, indent=4)
with open('metrics_results_wo.json', 'r') as f:
    metrics_wo = json.load(f)

with open('metrics_results_w_roberta.json', 'r') as f:
    metrics_w_roberta = json.load(f)

with open('metrics_results_vader.json', 'r') as f:
    metrics_vader = json.load(f)

def add_identifier(metrics_dict, identifier):
    return {f"{identifier} {key}": value for key, value in metrics_dict.items()}

metrics_wo_with_id = add_identifier(metrics_wo, "w/o")
metrics_w_roberta_with_id = add_identifier(metrics_w_roberta, "w_roberta")
metrics_vader_with_id = add_identifier(metrics_vader, "vader")

merged_metrics = {
    **metrics_wo_with_id,
    **metrics_w_roberta_with_id,
    **metrics_vader_with_id
}

with open('merged_metrics.json', 'w') as f:
    json.dump(merged_metrics, f, indent=4)

print("Merged metrics saved to: merged_metrics.json")
