import json

# Load the sentiment analysis data
with open('match_sentiment_analysis_results.json') as f:
    sentiment_data = json.load(f)

# Load the 2019-20 results data
with open('results_2019-20.json') as f:
    results_data = json.load(f)

# Prepare a modified sentiment data map for easier lookup
# Key: tuple of (HomeTeam, AwayTeam), Value: sentiment data dict
sentiment_data_map = {(game["HomeTeam"], game["AwayTeam"]): game for game in sentiment_data if game["HomeTeamPosts"] >= 4 and game["AwayTeamPosts"] >= 4}

# Combine the results data with the sentiment data when conditions are met
combined_data = []
for result in results_data:
    key = (result["HomeTeam"], result["AwayTeam"])
    if key in sentiment_data_map:
        # If the game meets the condition, combine result with sentiment data
        combined_game = {**result, **sentiment_data_map[key]}
    else:
        # If the game does not meet the condition, just use the result data
        combined_game = result
    combined_data.append(combined_game)

# Optionally, save the combined data to a new JSON file
with open('results_2019-20_with_sentiment.json', 'w') as f:
    json.dump(combined_data, f, indent=4)

print(f"Processed {len(combined_data)} games, with sentiment data added where applicable.")

