import requests
import json

url = "https://api.betfair.com/exchange/betting/json-rpc/v1"

header = {
    'X-Application': 'g36HRUnvW9anJJu0',
    'X-Authentication': 'BJmrpT6FJG3OHhcRqemf8XSKP9lh/2v2ggMUnGtd4wE=',
    'content-type': 'application/json'
}

jsonrpc_req = {
    "jsonrpc": "2.0",
    "method": "SportsAPING/v1.0/listMarketCatalogue",
    "params": {
        "filter": {
            "eventTypeIds": ["1"],
            "competitionIds": ["10932509"],
            "marketTypeCodes": ["MATCH_ODDS"],
        },
        "maxResults": "1000",
        "marketProjection": [
            "EVENT",
            "RUNNER_DESCRIPTION"
        ]
    },
    "id": 1
}

response = requests.post(url, data=json.dumps(jsonrpc_req), headers=header)

if response.status_code == 200:
    market_catalogue = json.loads(response.text)

    # Extract the marketIds from market_catalogue
    for market in market_catalogue['result']:
        marketId = market['marketId']

        # New request for listMarketBook
        jsonrpc_req = {
            "jsonrpc": "2.0",
            "method": "SportsAPING/v1.0/listMarketBook",
            "params": {
                "marketIds": [marketId],
                "priceProjection": {
                    "priceData": ["EX_BEST_OFFERS"]
                },
            },
            "id": 1
        }

        response = requests.post(url, data=json.dumps(jsonrpc_req), headers=header)

        if response.status_code == 200:
            # add the odds data to the original market
            market['odds'] = json.loads(response.text)['result']
        else:
            print("Request to listMarketBook was not successful for marketId: ", marketId)

    # Define the name of the JSON file
    file_name = "betfair_response_with_odds.json"

    # Save the combined market catalogue and odds data to the file
    with open(file_name, 'w') as json_file:
        json.dump(market_catalogue, json_file, indent=3)

    print(f"Response saved to {file_name}")
else:
    print("Request to listMarketCatalogue was not successful. Response not saved.")