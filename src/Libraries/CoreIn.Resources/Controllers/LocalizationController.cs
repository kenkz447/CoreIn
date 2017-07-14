using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Options;

namespace CoreIn.Resources.Controllers
{
    public class LocalizationController : Controller
    {
        private readonly IOptions<RequestLocalizationOptions> _localizationOptions;

        public LocalizationController(IOptions<RequestLocalizationOptions> localizationOptions)
        {
            _localizationOptions = localizationOptions;
        }

        [HttpPost]
        public IActionResult Switch(string culture)
        {
            var refer = Request.Headers.FirstOrDefault(o => o.Key == "Referer").Value[0];
            var currentCulture = CultureInfo.CurrentCulture.Name;

            Response.Cookies.Append(
                CookieRequestCultureProvider.DefaultCookieName,
                CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
                new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
            );

            Uri myUri = new Uri(refer);
            var hostDomain = $"{myUri.Scheme}://{myUri.Authority}";

            var path = refer.Remove(0, hostDomain.Count());
            if (path.StartsWith($"/{currentCulture}"))
                path = path.Replace($"/{currentCulture}", string.Empty);

            if (_localizationOptions.Value.DefaultRequestCulture.Culture.Name != culture)
                hostDomain += $"/{culture}";

            var redirectUrl = $"{hostDomain}{path}";

            return Redirect(redirectUrl);
        }
    }
}