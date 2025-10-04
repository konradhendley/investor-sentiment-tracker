import { useEffect, useState } from "react";

type Sentiment = {
  ticker: string;
  sentiment: string;
  score: number;
};

export default function HomePage() {
  const [data, setData] = useState<Sentiment | null>(null);

  useEffect(() => {
    fetch("https://ctn3idxomcn7v73jrpqvewc3ry0cjjro.lambda-url.us-east-1.on.aws/")
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return (
    <div>
      <h1>Investor Sentiment Tracker</h1>
      {data ? (
        <p>
          {data.ticker}: {data.sentiment} (Score: {data.score})
        </p>
      ) : (
        <p>Loading sentiment...</p>
      )}
    </div>
  );
}