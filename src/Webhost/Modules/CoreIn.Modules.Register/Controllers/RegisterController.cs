using System;
using System.Collections.Generic;
using CoreIn.App.Attributes;
using CoreIn.Models.Authentication;
using CoreIn.Modules.Register.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Serialization;
using System.Linq;
using System.Threading.Tasks;
using CoreIn.App.ViewModels;
using CoreIn.Resources;
using Microsoft.Extensions.Localization;

namespace CoreIn.Modules.Register.Controllers
{
    public class RegisterController : Controller
    {
        #region Private Fields
        private readonly UserManager<User> _userManager;
        private readonly ILogger _logger;
        private readonly IStringLocalizer<Language> _moduleLocalizer;
        #endregion

        #region Constructor
        public RegisterController(UserManager<User> userManager, ILoggerFactory loggerFactory, IStringLocalizer<Language> moduleLocalizer)
        {
            _userManager = userManager;
            _logger = loggerFactory.CreateLogger<RegisterController>();
            _moduleLocalizer = moduleLocalizer;
        }
        #endregion

        #region Private Methods
        private ActionViewModel GetPageViewModel(string viewName, dynamic viewData = null)
        {
            ActionViewModel pageViewModel = null;
            switch (viewName)
            {
                case "index":
                    {
                        pageViewModel = new ActionViewModel(
                            title: _moduleLocalizer["Register"],
                            resourceDictionary: new Dictionary<string, string>
                                {
                                    {"loginBtnLabel", _moduleLocalizer["Login"]},
                                    {"successMessageTitle", _moduleLocalizer["Congratulations"]},
                                    {"successMessage", _moduleLocalizer["Registration has been successfully completed, click button below to login with your account."]}
                                }
                        );

                        var formViewModel = new FormViewModel(
                            title: _moduleLocalizer["Register"],
                            description: _moduleLocalizer["Create your account"]);

                        formViewModel.GenerateFields(new RegisterViewModel());

                        pageViewModel.AddForm(
                            formViewModel: formViewModel,
                            formName: "default"
                        );
                        break;
                    }
            }
            return pageViewModel;
        }
        #endregion

        #region Action: Index
        public IActionResult Index()
        {
            var pageViewModel = this.GetPageViewModel("index");
            ViewBag.Title = pageViewModel.Title;

            return View(pageViewModel);
        }

        [HttpPost]
        [ValidateAjax]
        public async Task<JsonResult> Index(RegisterViewModel model, string returnUrl = null)
        {
            object result;

            var user = new User
            {
                UserName = model.Email,
                Email = model.Email
            };

            try
            {
                var registerResult = await _userManager.CreateAsync(user, model.Password);

                if (registerResult.Succeeded)
                {
                    var returnUrlResult = Url.Action("index", "login", new { username = user.UserName, returnUrl = returnUrl, @ref = "register" });
                    result = new { result = "success", returnUrl = returnUrlResult };
                }
                else
                {
                    var errors = new
                    {
                        _error = "Can't register!",
                        Email = registerResult.Errors.FirstOrDefault(o => o.Code == "DuplicateUserName").Description
                    };
                    result = new { result = "error", message = "Can't register!", errors = errors };
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }

            return Json(result);
        }
        #endregion

    }
}
