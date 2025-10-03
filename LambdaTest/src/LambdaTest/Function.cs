using System.Text.Json;
using Amazon.Lambda.Core;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace LambdaTest
{
    public class LambdaHandler
    {
        public string handleRequest(ILambdaContext context)
        {
            var response = new {
                ticker = "AAPL",
                sentiment = "positive",
                score = 0.72
            };
            return JsonSerializer.Serialize(response);
        }
    }
}
