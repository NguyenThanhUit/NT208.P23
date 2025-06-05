using System;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using System.Threading.Tasks;

public class SMSConfig
{
    public string AccountSid { get; set; }
    public string AuthToken { get; set; }
    public string Sender { get; set; }
}

public interface ISMSSender
{
    Task SendSMS(string phoneNumber, string message);
}

public class SMSSender : ISMSSender
{
    private readonly SMSConfig _smsConfig;

    public SMSSender()
    {
        _smsConfig = new SMSConfig
        {
            AccountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID"),
            AuthToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN"),
            Sender = "E-Shop"
        };

        // Khởi tạo Twilio client
        TwilioClient.Init(_smsConfig.AccountSid, _smsConfig.AuthToken);
    }

    public async Task SendSMS(string phoneReceiver = "", string message = "")
    {
        string phoneSender = Environment.GetEnvironmentVariable("SENDER");
        if (!phoneReceiver.StartsWith("+"))
            phoneReceiver = "+84" + phoneReceiver.Substring(1);

        var SMS = await MessageResource.CreateAsync(
            from: new Twilio.Types.PhoneNumber(phoneSender),
            to: new Twilio.Types.PhoneNumber(phoneReceiver),
            body: message
        );
    }
}