//main file
import { useEffect, useState } from "react";

type Sentiment = {
  ticker: string;
  sentiment: string;
  score: number;
};

function App() {
  const [data, setData] = useState<Sentiment | null>(null);

  useEffect(() => {
    fetch("https://ctn3idxomcn7v73jrpqvewc3ry0cjjro.lambda-url.us-east-1.on.aws/")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="App">
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

export default App;