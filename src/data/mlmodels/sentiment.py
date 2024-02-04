import praw
import datetime
import pytz
import json

import requests

# Load the JSON data from your file
file_path = 'results_2019-20.json'  # Replace with the path to your JSON file
with open(file_path, 'r') as file:
    matches = json.load(file)

# Calculate the index for the last 30% of matches
last_30_percent_index = int(len(matches) * 0.7)
last_30_percent_matches = matches[last_30_percent_index:]

# Map team names to subreddit names
team_subreddits = {
    "AFC Wimbledon": "afcwimbledon",
    "Arsenal": "gunners",
    "Aston Villa": "avfc",
    "Barnet": "BarnetFc",
    "Birmingham City": "bcfc",
    "Blackburn Rovers": "brfc",
    "Bolton Wanderers": "bwfc",
    "Bournemouth": "AFCBournemouth",
    "Bradford City": "bantams",
    "Brentford": "Brentford",
    "Brighton and Hove Albion": "BrightonHoveAlbion",
    "Bristol City": "BristolCity",
    "Bristol Rovers": "bristolrovers",
    "Burnley": "burnley",
    "Burton Albion": "BurtonFC",
    "Cardiff City": "bluebirds",
    "Carlisle United": "cufc",
    "Charlton Athletic": "CharltonAthletic",
    "Chelsea": "chelseafc",
    "Cheltenham Town": "CTFC",
    "Coventry City": "CCFC",
    "Crewe Alexandra": "crewealexandra",
    "Crystal Palace": "crystalpalace",
    "Dagenham & Redbridge": "dagandred",
    "Derby County": "derbycounty",
    "Everton": "Everton",
    "Exeter City": "weownourfc",
    "FC United of Manchester": "fcum",
    "Fulham": "FulhamFC",
    "Forest Green Rovers": "FGR",
    "Grimsby Town": "GTFC",
    "Hereford FC": "HerefordFC",
    "Huddersfield Town": "HuddersfieldTownFC",
    "Hull City": "HullCity",
    "Ipswich Town": "IpswichTownFC",
    "Leeds United": "LeedsUnited",
    "Leicester City": "lcfc",
    "Leyton Orient": "LeytonOrient",
    "Liverpool": "LiverpoolFC",
    "Luton Town": "COYH",
    "Manchester City": "MCFC",
    "Manchester United": "reddevils",
    "Middlesbrough": "Middlesbrough",
    "Milton Keynes Dons": "MK_Dons",
    "Morecambe": "MorecambeFC",
    "Newcastle United": "nufc",
    "Norwich City": "NorwichCity",
    "Nottingham Forest": "nffc",
    "Notts County": "NottsCounty",
    "Oxford United": "OxfordUnitedFC",
    "Peterborough United": "ThePosh",
    "Plymouth Argyle": "PAFC",
    "Preston North End": "pne",
    "Portsmouth": "PortsmouthFC",
    "QPR": "superhoops",
    "Reading": "Urz",
    "Redditch United": "Redditch",
    "Rochdale": "RochdaleAFC",
    "Rotherham United": "RotherhamUtd",
    "Sheffield United": "SheffieldUnited",
    "Sheffield Wednesday": "sheffieldwednesday",
    "Southampton": "SaintsFC",
    "Southend United": "southendunited",
    "Stevenage": "StevenageFC",
    "Stockport County": "stockportcounty",
    "Stoke City": "StokeCityFC",
    "Sunderland": "SAFC",
    "Swindon Town": "swindontown",
    "Tottenham Hotspur": "coys",
    "Tranmere Rovers": "tranmererovers",
    "Watford": "Watford_FC",
    "West Brom": "WBAfootball",
    "West Ham": "Hammers",
    "Wigan Athletic": "latics",
    "Woking": "WokingFC",
    "Wolves": "WWFC",
    "York City": "yorkcityfc"
}

PRAW_USERNAME = 'mostcritisedcritic'
PRAW_PASSWORD = '%Qw!SNSSf17Wfdq'
PRAW_KEY = 'J5AjfiF0dgNbEo7XHSUx2w'
PRAW_SECRET = '0EIWqujP0JoBs2xMhU_Orey5hsm9iQ'
PRAW_USER_AGENT = 'reddit.com/user/mostcritisedcritic/'

# Initialize PRAW
reddit = praw.Reddit(client_id=PRAW_KEY,
                     client_secret=PRAW_SECRET,
                     password=PRAW_PASSWORD,
                     user_agent=PRAW_USER_AGENT,
                     username=PRAW_USERNAME)

def get_posts_before_match(subreddit, start_time, end_time):
    url = "https://api.pushshift.io/reddit/search/submission/"
    params = {
        "subreddit": subreddit,
        "before": int(end_time.timestamp()),
        "after": int(start_time.timestamp()),
        "size": 500  # Max size of the response
    }
    response = requests.get(url, params=params)

    # Check if the response status code is 200 (OK)
    if response.status_code != 200:
        print(f"Error fetching data from Pushshift API: Status Code {response.status_code}")
        return []

    try:
        posts = response.json().get("data", [])
        return [{"title": post["title"], "url": post["url"], "created_utc": post["created_utc"]} for post in posts]
    except json.JSONDecodeError:
        print("Failed to decode JSON from response.")
        return []

# Iterate over the matches and fetch posts
for match in last_30_percent_matches:
    home_team = match['HomeTeam']
    away_team = match['AwayTeam']
    match_time = datetime.datetime.strptime(match['DateTime'], '%Y-%m-%dT%H:%M:%SZ')

    # Define the time range: one hour before the match
    one_hour_before = match_time - datetime.timedelta(hours=1)

    home_subreddit = team_subreddits.get(home_team)
    away_subreddit = team_subreddits.get(away_team)

    if home_subreddit:
        print(f"Searching for posts in /r/{home_subreddit} for the match between {home_team} and {away_team}")
        home_posts = get_posts_before_match(home_subreddit, one_hour_before, match_time)
        # Process the posts from the home team subreddit

    if away_subreddit:
        print(f"Searching for posts in /r/{away_subreddit} for the match between {home_team} and {away_team}")
        away_posts = get_posts_before_match(away_subreddit, one_hour_before, match_time)