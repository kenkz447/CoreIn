using Microsoft.AspNetCore.Mvc;
using MailKit.Net.Smtp;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.Homeclick.Controllers
{
    public class FormController : Controller
    {
        [HttpPost]
        public JsonResult Contact(string fullName, string email, string phone, string message)
        {
            try
            {
                //From Address 
                string FromAddress = "kobietdattenlagi@gmail.com";
                string FromAdressTitle = "dbgroupvn.com";
                //To Address 
                string ToAddress = "kenkz447@gmail.com";
                string ToAdressTitle = fullName + " | " + phone + " | " + email;
                string Subject = "Message from dbgroupvn.com";
                string BodyContent = message;

                string SmtpServer = "smtp.gmail.com";
                int SmtpPortNumber = 587;

                var mimeMessage = new MimeMessage();
                mimeMessage.From.Add(new MailboxAddress(FromAdressTitle, FromAddress));
                mimeMessage.To.Add(new MailboxAddress(ToAdressTitle, ToAddress));
                mimeMessage.Subject = Subject;
                mimeMessage.Body = new TextPart("plain")
                {
                    Text = BodyContent
                };

                using (var client = new SmtpClient())
                {

                    client.Connect(SmtpServer, SmtpPortNumber, false);
                    // Note: only needed if the SMTP server requires authentication 
                    // Error 5.5.1 Authentication  
                    client.Authenticate("kobietdattenlagi@gmail.com", "tung1111");
                    client.Send(mimeMessage);
                    client.Disconnect(true);
                    return Json(true);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
