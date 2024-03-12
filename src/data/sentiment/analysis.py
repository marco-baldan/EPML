import json
from datetime import datetime, timedelta
import pytz
from collections import defaultdict
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from transformers import pipeline
import pandas as pd

def load_json(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def utc_to_datetime(utc):
    return datetime.utcfromtimestamp(utc).replace(tzinfo=pytz.utc)

def roberta_label_to_score(label):
    return {'LABEL_0': -1, 'LABEL_1': 0, 'LABEL_2': 1}.get(label, 0)

vader_analyzer = SentimentIntensityAnalyzer()
roberta_analyzer = pipeline('sentiment-analysis', model='cardiffnlp/twitter-roberta-base-sentiment')

matches = load_json('results_2019-20.json')


reddit_data = load_json('combined_output.json')

team_to_subreddit = {
    "Arsenal": "Gunners",
    "Man United": "reddevils",
    "Leicester": "lcfc",
    "Southampton": "SaintsFC",
    "West Ham": "Hammers",
    "Everton": "Everton",
    "Tottenham": "coys",
    "Chelsea": "chelseafc",
    "Liverpool": "LiverpoolFC",
    "Aston Villa": "avfc",
    "Crystal Palace": "crystalpalace",
    "Brighton": "BrightonHoveAlbion",
    "Burnley": "Burnley",
    "Newcastle": "NUFC",
    "Bournemouth": "AFCBournemouth",
    "Sheffield United": "SheffieldUnited",
    "Watford": "Watford_FC",
    "Wolves": "WWFC",
    "Norwich": "NorwichCity", # Adjust based on your data
    "Man City": "MCFC",
}

post_counts = defaultdict(int)
vader_scores = defaultdict(float)
roberta_scores = defaultdict(float)
overall_post_counts = defaultdict(int)
overall_vader_scores = defaultdict(float)
overall_roberta_scores = defaultdict(float)
match_results = []

for match_details in matches:
    game_datetime = datetime.strptime(match_details['DateTime'], "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=pytz.utc)
    home_team = match_details['HomeTeam']
    away_team = match_details['AwayTeam']

    post_counts = defaultdict(int)
    vader_scores = defaultdict(float)
    roberta_scores = defaultdict(float)

    for index, post in enumerate(reddit_data):
        post_datetime = utc_to_datetime(post['created_utc'])
        if game_datetime - timedelta(hours=8) <= post_datetime < game_datetime:
            if index % 100 == 0:
                print(f"Processing post {index}/{len(reddit_data)} for game {home_team} vs {away_team}...")
                
            subreddit = post['subreddit']
            for team, subreddit_name in team_to_subreddit.items():
                if subreddit == subreddit_name:
                    text = post['text_content']
                    vader_score = vader_analyzer.polarity_scores(text)['compound']
                    roberta_result = roberta_analyzer(text[:512])
                    roberta_score = roberta_label_to_score(roberta_result[0]['label'])
                    
                    post_counts[team] += 1
                    vader_scores[team] += vader_score
                    roberta_scores[team] += roberta_score
        match_result = {
        "HomeTeam": home_team,
        "HomeTeamScoreVader": vader_scores[home_team] / post_counts[home_team] if post_counts[home_team] else 0,
        "HomeTeamScoreRoberta": roberta_scores[home_team] / post_counts[home_team] if post_counts[home_team] else 0,
        "HomeTeamPosts": post_counts[home_team],
        "AwayTeam": away_team,
        "AwayTeamScoreVader": vader_scores[away_team] / post_counts[away_team] if post_counts[away_team] else 0,
        "AwayTeamScoreRoberta": roberta_scores[away_team] / post_counts[away_team] if post_counts[away_team] else 0,
        "AwayTeamPosts": post_counts[away_team]
    }
    
    match_results.append(match_result)

    # After processing all relevant posts for a game, calculate and print average scores
    print(f"\nGame: {home_team} vs {away_team} on {match_details['DateTime']}")
    for team in [home_team, away_team]:
        if team in team_to_subreddit:  # Check if team is mapped
            avg_vader_score = vader_scores[team] / post_counts[team] if post_counts[team] else 0
            avg_roberta_score = roberta_scores[team] / post_counts[team] if post_counts[team] else 0
            print(f"{team}:")
            print(f"  Total Posts Analyzed: {post_counts[team]}")
            print(f"  Average VADER Score: {avg_vader_score:.3f}")
            print(f"  Average ROBERTA Score: {avg_roberta_score:.3f}")

            # Update overall results for final summary
            overall_post_counts[team] += post_counts[team]
            overall_vader_scores[team] += vader_scores[team]
            overall_roberta_scores[team] += roberta_scores[team]
        else:
            print(f"No subreddit mapping found for {team}.")
df = pd.DataFrame(match_results)
df.to_json("match_sentiment_analysis_results.json", orient="records")