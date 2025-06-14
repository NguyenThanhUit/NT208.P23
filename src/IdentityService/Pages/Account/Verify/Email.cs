using Microsoft.Extensions.Options;
using System.Net.Mail;
using System.Threading.Tasks;

public class EmailConfig
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Host { get; set; }
    public int Port { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public bool EnableSsl { get; set; }
}

// IEmailSender là một giao diện cung cấp hàm SendEmailAsync
public interface IEmailSender
{
    Task SendEmail(string email, string subject, string message);
}

// EmailSender có hàm SendEmailAsync gửi email chứa OTP
public class EmailSender : IEmailSender
{
    public EmailConfig _emailconfig = new EmailConfig
    {
        Name = "E-Shop",
        Email = "nghoangphuc1201@gmail.com",               // Nhập trực tiếp email người gửi
        Host = "smtp.gmail.com",
        Port = 587,
        Username = "nghoangphuc1201@gmail.com",            // Nhập trực tiếp username
        Password = "oxkmuqmvkpmknzsx",                     // Nhập trực tiếp App Password
        EnableSsl = true
    };

    // Hàm SendEmailAsync để gửi email chứa mã OTP.
    public async Task SendEmail(string email, string subject, string message)
    {
        // Tạo email
        MailMessage mail = new MailMessage
        {
            From = new MailAddress(_emailconfig.Email, _emailconfig.Name),
            Subject = subject,
            Body = message,
            IsBodyHtml = true
        };
        mail.To.Add(email);

        // Dùng giao thức SMTP để gửi email
        using SmtpClient _sender = new SmtpClient(_emailconfig.Host, _emailconfig.Port)
        {
            Credentials = new System.Net.NetworkCredential(_emailconfig.Username, _emailconfig.Password),
            EnableSsl = _emailconfig.EnableSsl,
            Timeout = 3000
        };

        // Gửi email
        await _sender.SendMailAsync(mail);
    }
}
