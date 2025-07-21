import requests
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("NEWS_API_KEY")
ENDPOINT = "https://newsapi.org/v2/everything"

def fetch_headlines(query="stock market"):
    params = {
        "q": query,
        "language": "en",
        "sortBy": "publishedAt",
        "apiKey": API_KEY,
        "pageSize": 10,
    }
    response = requests.get(ENDPOINT, params=params)
    response.raise_for_status()
    return response.json()["articles"]

if __name__ == "__main__":
    articles = fetch_headlines()
    for article in articles:
        print(article["title"])