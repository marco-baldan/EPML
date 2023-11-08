import csv
import json

# Input CSV file and output JSON file
csv_file = 'new.csv'
json_file = 'results.json'

data = []

# Read CSV file and convert to JSON
with open(csv_file, 'r') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    for row in csv_reader:
        data.append(row)

# Write JSON data to a file
with open(json_file, 'w') as json_file:
    json.dump(data, json_file, indent=2)

print(f'CSV data has been successfully converted to JSON and saved to {json_file}.')
