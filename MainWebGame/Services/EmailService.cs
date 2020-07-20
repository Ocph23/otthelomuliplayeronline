/*using MailKit.Net.Smtp;
using MimeKit;

namespace MainWebGame {
    public interface IEmailService {
        void SendEmail (string destination, string messageText);

    }

    public class EmailService : IEmailService {
       *//* public void SendEmail (string destination, string messageText) {
            MimeMessage message = new MimeMessage ();
            MailboxAddress from = new MailboxAddress ("WPKS",
                "ocph23.test@gmail.com");
            message.From.Add (from);

            MailboxAddress to = new MailboxAddress ("User", destination);
            message.To.Add (to);

            message.Subject = "Verifikasi Accpunt";
            BodyBuilder bodyBuilder = new BodyBuilder ();
            bodyBuilder.HtmlBody = messageText;
            bodyBuilder.TextBody = "Hello World!";
            message.Body = bodyBuilder.ToMessageBody ();

            SmtpClient client = new SmtpClient ();
            client.Connect ("smtp.gmail.com", 587, false);
            client.Authenticate ("ocph23.test@gmail.com", "Sony@7777");
            client.Send (message);
            client.Disconnect (true);
            client.Dispose ();
        }
*//*
    }
}*/