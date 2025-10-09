"use client";
import { useEffect, useState } from "react";

type Quote = {
  c: number;  // current price
  d: number;  // change
  dp: number; // percent change
  h: number;  // high
  l: number;  // low
  o: number;  // open
  pc: number; // previous close
  t: number;  // timestamp (Unix seconds)
};

type ApiResponse = {
  success: boolean;
  data: Record<string, { Quote: Quote }>;
};

function App() {
  const [quotes, setQuotes] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("https://ctn3idxomcn7v73jrpqvewc3ry0cjjro.lambda-url.us-east-1.on.aws/");
      const json = await res.json();
      setQuotes(json);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-2xl font-semibold text-gray-700 animate-pulse">
          Loading quotes...
        </p>
      </div>
    );
  }

  if (!quotes || !quotes.success) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl font-semibold text-red-600">
          Failed to fetch data from API.
        </p>
      </div>
    );
  }

  // Calculate top gainer and loser
  const allQuotes = Object.entries(quotes.data);
  const topGainer = allQuotes.reduce((max, q) => (q[1].Quote.dp > max[1].Quote.dp ? q : max));
  const topLoser = allQuotes.reduce((min, q) => (q[1].Quote.dp < min[1].Quote.dp ? q : min));

  return (
    <div className="bg-black-50 min-h-screen flex flex-col items-center p-8">
      <header className="flex flex-col sm:flex-row justify-between items-center py-8 bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg w-full rounded-b-3xl mb-10 px-6">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold tracking-tight">Magnificent 7 Stocks</h1>
          <p className="text-lg mt-2 text-indigo-100">
            Real-time quotes powered by Finnhub
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={refreshing}
          className={`mt-6 sm:mt-0 bg-white text-indigo-600 font-semibold px-5 py-2 rounded-lg shadow-md transition transform hover:-translate-y-0.5 hover:shadow-lg ${
            refreshing ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {refreshing ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Refreshing...
            </span>
          ) : (
            "🔄 Refresh Data"
          )}
        </button>
      </header>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl">
        {allQuotes.map(([symbol, { Quote }]) => {
          const updatedAt = new Date(Quote.t * 1000).toLocaleString();
          const isTopGainer = symbol === topGainer[0];
          const isTopLoser = symbol === topLoser[0];

          const borderClass = isTopGainer
            ? "border-green-500"
            : isTopLoser
            ? "border-red-500"
            : "border-gray-200";

          const bgGradient = Quote.dp >= 0
            ? "bg-gradient-to-b from-green-50 to-white"
            : "bg-gradient-to-b from-red-50 to-white";

          return (
            <div
              key={symbol}
              className={`p-6 rounded-2xl shadow-md border-2 ${borderClass} ${bgGradient} transition transform hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-black">{symbol}</h2>
                <span
                  className={`px-2 py-1 text-sm font-medium rounded-md ${
                    Quote.dp >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {Quote.dp >= 0 ? "↑" : "↓"} {Quote.dp.toFixed(2)}%
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">Updated: {updatedAt}</p>
              <p className="text-lg text-black">
                <span className="font-semibold text-black">Current:</span>{" "}
                ${Quote.c.toFixed(2)}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Change:</span>{" "}
                {Quote.d >= 0 ? "+" : ""}
                {Quote.d.toFixed(2)}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Open:</span> ${Quote.o.toFixed(2)} |{" "}
                <span className="font-semibold">Prev Close:</span> ${Quote.pc.toFixed(2)}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">High:</span> ${Quote.h.toFixed(2)} |{" "}
                <span className="font-semibold">Low:</span> ${Quote.l.toFixed(2)}
              </p>

              {isTopGainer && (
                <p className="mt-4 text-green-600 font-semibold text-sm">
                  Best Performer of the Day
                </p>
              )}
              {isTopLoser && (
                <p className="mt-4 text-red-600 font-semibold text-sm">
                  Worst Performer of the Day
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;