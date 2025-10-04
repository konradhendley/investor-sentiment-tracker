using System.Text.Json;
using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace LambdaTest
{
    public class LambdaHandler
    {
        public APIGatewayProxyResponse HandleRequest(APIGatewayProxyRequest request, ILambdaContext context)
        {
            var response = new {
                ticker = "AAPL",
                sentiment = "positive",
                score = 0.72
            };

            return new APIGatewayProxyResponse
            {
                StatusCode = 200,
                Headers = new Dictionary<string, string>
                {
                    { "Content-Type", "application/json" },
                },
                Body = JsonSerializer.Serialize(response)
            };
        }
    }
}
