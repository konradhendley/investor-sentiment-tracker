# routes/sentiment.py

from fastapi import APIRouter, HTTPException
from utils.finnhub_client import fetch_news_sentiment

router = APIRouter()

@router.get("/sentiment/{symbol}")
async def get_sentiment(symbol: str):
    try:
        sentiment_data = fetch_news_sentiment(symbol.upper())
        return {
            "symbol": symbol.upper(),
            "sentiment": sentiment_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))