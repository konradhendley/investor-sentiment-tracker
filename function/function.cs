using System.Text.Json;

public class Function
{
    public string FunctionHandler()
    {
        var response = new {
            ticker = "AAPL",
            sentiment = "positive",
            score = 0.72
        };
        return JsonSerializer.Serialize(response);
    }
}