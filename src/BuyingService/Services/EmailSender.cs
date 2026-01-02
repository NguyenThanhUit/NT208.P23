using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

public interface IEmailSender
{
    Task SendEmailAsync(string toEmail, string subject, string body);
}

public class EmailSender : IEmailSender
{
    private readonly string _smtpHost = "smtp.gmail.com";
    private readonly int _smtpPort = 587;
    private readonly string _smtpUser = "null";
    private readonly string _smtpPass = "null";

    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        var message = new MailMessage();
        message.From = new MailAddress(_smtpUser);
        message.To.Add(toEmail);
        message.Subject = subject;
        message.Body = body;
        message.IsBodyHtml = false;

        using var client = new SmtpClient(_smtpHost, _smtpPort)
        {
            Credentials = new NetworkCredential(_smtpUser, _smtpPass),
            EnableSsl = true
        };

        await client.SendMailAsync(message);
    }
}
