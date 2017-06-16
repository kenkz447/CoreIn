using CoreIn.EntityCore;
using CoreIn.Themes.DbGroupVn.Resources;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Localization;
using Microsoft.Extensions.Options;
using System.Dynamic;
using System.Linq;

namespace CoreIn.Themes.DbGroupVn.Controllers
{
    public class DbGroupVnController : Controller
    {
        private IViewLocalizer _localizer;
        private IOptions<RequestLocalizationOptions> _localizationOptions;
        private IMenuHelper _menuHelper;

        public DbGroupVnController(
            IViewLocalizer localizer, 
            IOptions<RequestLocalizationOptions> localizationOptions,
            IMenuHelper menuHelper)
        {
            _localizer = localizer;
            _localizationOptions = localizationOptions;
            _menuHelper = menuHelper;
        }

        #region Private methods
        private object GetSupportedLangnuages() 
            => _localizationOptions.Value.SupportedUICultures
                .Select(c => new { Name = c.Name, Title = c.Parent.EnglishName })
                .ToList();

        /// <summary>
        /// Lấy cult hiện tại từ cookies với key ".AspNetCore.Culture"
        /// Ví dụ: cookie cho vn-VN có giá trị là "c=vi-VN|uic=vi-VN", giá trị trả về sau khi sử lý là "vi-VN"
        /// </summary>
        /// <returns></returns>
        private string GetCurrentLanguage()
        {
            var key = ".AspNetCore.Culture";

            var cookie = Request.Cookies.ContainsKey(key) ? Request.Cookies[key] : null;
            if (cookie != null)
                return cookie.Split('|')[0].Split('=')[1];

            var defaultCulName = _localizationOptions.Value.DefaultRequestCulture.Culture.Name;
            Response.Cookies.Append(key, $"c={defaultCulName}|uic={defaultCulName}");

            return defaultCulName;
        }


        #endregion

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetSiteInitData()
        {
            dynamic initData = new ExpandoObject();

            initData.localization = new
            {
                languages = this.GetSupportedLangnuages(),
                currentLanguage = this.GetCurrentLanguage()
            };

            initData.menu = new
            {
                menuItems = _menuHelper.GetMenuViewModel(Keys.PrimaryMenu).Items.OrderBy(o => o.Order).Select(o => new {
                    Title = o.Title,
                    Url = o.Url,
                    Order = o.Order,
                    Footer = o.Details.ContainsKey("Footer") ? o.Details["Footer"] : null
                })
            };

            return Json(initData);
        }
    }
}