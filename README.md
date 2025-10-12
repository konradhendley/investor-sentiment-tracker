# Market Valuation Tracker

This project tracks real-time stock data of the **Magnificent 7** stocks.

## Features
- Fetches real-time stock quotes for the Magnificent 7 using the **Finnhub API**
- AWS Lambda backend (C#) for data fetching and API hosting
- React + Tailwind CSS frontend for visualization
- Future plans: sentiment analysis from financial news and social media, historical trend tracking, and ML-based insights

## Getting Started

### Backend (AWS Lambda)
1. Navigate to the `LambdaTest` folder.
2. Update your environment variable `FINNHUB_API_KEY` in the Lambda configuration.
3. Zip and upload the `LambdaTest/bin/Debug/net8.0` contents to your AWS Lambda function.
4. Copy the Lambda Function URL and update it in the frontend fetch call.

### Frontend (React)
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install