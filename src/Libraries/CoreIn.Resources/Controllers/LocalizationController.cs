using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;

namespace CoreIn.Resources.Controllers
{
    public class LocalizationController : Controller
    {
        [HttpPost]
        public IActionResult Switch(string culture)
        {
            Response.Cookies.Append(
                CookieRequestCultureProvider.DefaultCookieName,
                CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
                new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
            );
            var refer = Request.Headers.FirstOrDefault(o => o.Key == "Referer");
            return Redirect(refer.Value[0]);
        }
    }
}