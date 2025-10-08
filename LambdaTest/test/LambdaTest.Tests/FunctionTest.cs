using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.TestUtilities;
using LambdaTest; 
using Xunit;

namespace LambdaTest.Tests
{
    public class FunctionTest
    {
        [Fact]
        public async Task HandleRequest_ReturnsMagnificent7Data()
        {
            // Arrange
            Environment.SetEnvironmentVariable("FINNHUB_API_KEY", "d1ur6vpr01qjvosbknngd1ur6vpr01qjvosbkno0");

            var request = new APIGatewayProxyRequest
            {
                HttpMethod = "GET",
                Path = "/test",
                QueryStringParameters = new Dictionary<string, string>()
            };

            var handler = new LambdaHandler();
            var context = new TestLambdaContext();

            // Act
            var response = await handler.HandleRequest(request, context);

            // Assert: response is not null and status code is 200
            Assert.NotNull(response);
            Assert.Equal(200, response.StatusCode);

            // Deserialize response body
            var bodyJson = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(response.Body!);
            Assert.NotNull(bodyJson);

            // Assert success key exists and is true
            Assert.True(bodyJson!.ContainsKey("success"));
            Assert.True(bodyJson["success"].GetBoolean());

            // Assert data key exists
            Assert.True(bodyJson.ContainsKey("data"));

            // Assert all Magnificent 7 tickers are present
            var dataJson = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(bodyJson["data"].GetRawText())!;
            var magnificent7 = new string[] { "AAPL", "MSFT", "NVDA", "AMZN", "TSLA", "GOOGL", "META" };

            foreach (var ticker in magnificent7)
            {
                Assert.True(dataJson.ContainsKey(ticker), $"Ticker {ticker} is missing in response data.");
                 
                var tickerData = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(dataJson[ticker].GetRawText())!;
                var quoteData = tickerData["Quote"];
                var quoteDict = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(quoteData.GetRawText())!;
            }
        }
    }
}
