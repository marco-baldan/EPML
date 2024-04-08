import json

# Open the JSON file
with open('results_2019-20_with_sentiment.json', 'r') as f:
    data = json.load(f)

# Iterate through each object in the JSON
for obj in data:
    # Check if the keys contain 'Vader'
    for key in list(obj.keys()):
        if 'Vader' in key:
            # Update the key to 'Vadar'
            new_key = key.replace('Vader', 'Vadar')
            obj[new_key] = obj.pop(key)

# Save the modified JSON back to the file
with open('your_file_modified.json', 'w') as f:
    json.dump(data, f, indent=4)
