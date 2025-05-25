using Infobip.Api.SDK;
using Infobip.Api.SDK.SMS.Models;

using Microsoft.Extensions.Configuration;

public class SMSConfig
{
    public string ApiKey { get; set; }
    public string BaseUrl { get; set; }
    public string Sender { get; set; } 
}

public interface ISMSSender
{
    Task SendSMS(string phoneNumber, string message);
}

public class SMSSender : ISMSSender
{
    public InfobipApiClient _sender = null;
    public SMSConfig _smsconfig = new SMSConfig
    {
        // Sử dụng Infobip để gửi SMS
        ApiKey = Environment.GetEnvironmentVariable("INFOBIP_API_KEY"),
        BaseUrl = Environment.GetEnvironmentVariable("INFOBIP_BASE_URL"),
        Sender = "E-Shop"
    };

    public async Task SendSMS(string phoneNumber = "", string message = "")
    {
        // Tạo instance của InfobipSmsClient để gửi SMS
        ApiClientConfiguration credentials = new ApiClientConfiguration(_smsconfig.BaseUrl, _smsconfig.ApiKey);

        _sender = new InfobipApiClient(credentials);

        // Thiết lập SMS
        SendSmsMessageRequest request = new SendSmsMessageRequest
        {
            Messages = new List<SmsMessage>
            {
                new SmsMessage
                {
                    From = _smsconfig.Sender,
                    Destinations = new List<SmsDestination> { new SmsDestination(to: phoneNumber) },
                    Text = message
                }
            }
        };

        // Gửi SMS
        await _sender.Sms.SendSmsMessage(request);
    }
}
