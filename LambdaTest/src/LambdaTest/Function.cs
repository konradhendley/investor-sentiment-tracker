using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace LambdaTest
{
    public class LambdaHandler
    {
        private static readonly HttpClient httpClient = new HttpClient();
        private readonly string apiKey;

        // Magnificent 7 tickers
        private readonly string[] tickers = new string[] { "AAPL", "MSFT", "NVDA", "AMZN", "TSLA", "GOOGL", "META" };

        public LambdaHandler()
        {
            apiKey = Environment.GetEnvironmentVariable("FINNHUB_API_KEY") 
                     ?? throw new InvalidOperationException("FINNHUB_API_KEY not set");
        }

        public async Task<APIGatewayProxyResponse> HandleRequest(APIGatewayProxyRequest request, ILambdaContext context)
        {
            var results = new Dictionary<string, object>();

            foreach (var ticker in tickers)
            {
                // Fetch real-time quote
                var quoteUrl = $"https://finnhub.io/api/v1/quote?symbol={ticker}&token={apiKey}";
                var quoteResponse = await httpClient.GetStringAsync(quoteUrl);
                var quoteData = JsonSerializer.Deserialize<Dictionary<string, object>>(quoteResponse);

                /* Fetch basic company fundamentals (potential future enhancment)
                var fundamentalsUrl = $"https://finnhub.io/api/v1/stock/metric?symbol={ticker}&metric=all&token={apiKey}";
                var fundamentalsResponse = await httpClient.GetStringAsync(fundamentalsUrl);
                var fundamentalsData = JsonSerializer.Deserialize<Dictionary<string, object>>(fundamentalsResponse);
                */

                results[ticker] = new
                {
                    Quote = quoteData,
                    //Fundamentals = fundamentalsData
                };
            }

            return new APIGatewayProxyResponse
            {
                StatusCode = 200,
                Body = JsonSerializer.Serialize(new
                {
                    success = true,
                    data = results
                }),
                Headers = new Dictionary<string, string>
                {
                    { "Content-Type", "application/json" },
                    { "Access-Control-Allow-Origin", "*" }
                }
            };
        }
    }
}
