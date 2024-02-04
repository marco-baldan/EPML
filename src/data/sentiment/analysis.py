import json
import pandas as pd
from nltk.sentiment import SentimentIntensityAnalyzer
from transformers import pipeline

# Load data from a JSON file
def load_data(file_path):
    data = []
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            try:
                data.append(json.loads(line))
            except json.JSONDecodeError as error:
                print(f"Error decoding JSON: {error}")
    return data

# Perform sentiment analysis using VADER
def analyze_sentiment_vader(text, analyzer):
    return analyzer.polarity_scores(text)['compound']

# Perform sentiment analysis using RoBERTa
def analyze_sentiment_roberta(text, model):
    # Truncate the text to avoid exceeding the maximum input length for the model
    truncated_text = text[:512]  # Simple truncation, consider word boundaries for better accuracy
    result = model(truncated_text)
    label = result[0]['label']
    score = result[0]['score']
    sentiment = 'POSITIVE' if 'POSITIVE' in label else 'NEGATIVE'
    return sentiment, score

def main(file_path):
    # Load data
    data = load_data(file_path)
    
    # Convert to DataFrame
    df = pd.DataFrame(data)
    
    # Initialize VADER SentimentIntensityAnalyzer
    sia = SentimentIntensityAnalyzer()
    
    # Initialize RoBERTa sentiment-analysis pipeline
    roberta = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
    
    # Analyze sentiment
    df['vader_score'] = df['text_content'].apply(lambda x: analyze_sentiment_vader(x, sia))
    df['roberta_result'], df['roberta_score'] = zip(*df['text_content'].apply(lambda x: analyze_sentiment_roberta(x, roberta)))
    
    # Save or display results
    print(df[['text_content', 'vader_score', 'roberta_result', 'roberta_score']])
    # Optionally, save the results to a new file
    # df.to_csv('reddit_sentiment_analysis_results.csv', index=False)

if __name__ == "__main__":
    file_path = 'reddit_s_09-2019.json'  # Ensure this path is correct
    main(file_path)
