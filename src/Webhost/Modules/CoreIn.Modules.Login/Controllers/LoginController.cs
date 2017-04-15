using CoreIn.Models.Authentication;
using CoreIn.Modules.Login.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoreIn.App.Attributes;
using CoreIn.App.ViewModels;
using CoreIn.Resources;
using Microsoft.Extensions.Localization;

namespace CoreIn.Modules.Login.Controllers
{
    public class LoginController : Controller
    {
        #region[Fields]
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ILogger _logger;
        private readonly IStringLocalizer<Language> _moduleLocalizer;
        #endregion

        #region Private Methods
        private ActionViewModel GetPageViewModel(string viewName, dynamic viewData = null)
        {
            ActionViewModel pageViewModel = null;
            switch (viewName)
            {
                case "index":
                {
                    var viewResources = new Dictionary<string, string>
                    {
                        { "register", _moduleLocalizer["Register"].Value},
                        { "registerDescription", _moduleLocalizer["Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"]},
                        { "registerLinkLabel", _moduleLocalizer["Register Now!"]},
                        { "registerUrl", Url.Action("index", "register", new { viewData?.returnUrl }) }
                    };

                    pageViewModel = new ActionViewModel(
                        title: _moduleLocalizer["Login"], 
                        resourceDictionary: viewResources);

                    var formViewModel = new FormViewModel(
                        title: _moduleLocalizer["Login"],
                        description: _moduleLocalizer["Login with your account"]);

                    formViewModel.GenerateFields(new LoginViewModel(){Email = viewData?.username});

                    pageViewModel.AddForm(
                        formName: "default",
                        formViewModel: formViewModel);

                    break;
                }
            }
            return pageViewModel;
        }
        #endregion

        public LoginController(UserManager<User> userManager, SignInManager<User> signInManager, ILoggerFactory loggerFactory, IStringLocalizer<Language> moduleLocalizer)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _moduleLocalizer = moduleLocalizer;
            _logger = loggerFactory.CreateLogger<LoginController>();
        }

        public IActionResult Index(string returnUrl = null, string username = null, string @ref = null)
        {
            var pageViewModel = GetPageViewModel(viewName: "index", viewData: new { username, returnUrl });
            ViewBag.Title = pageViewModel.Title;

            return View(pageViewModel);
        }

        [HttpPost]
        [ValidateAjax]
        public async Task<JsonResult> Index(LoginViewModel model, string returnUrl = null)
        {
            object result;

            var returnUrlResult = returnUrl ?? Url.Action("index", "dashboard");

            try
            {
                var loginResult = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: false);

                if (loginResult.Succeeded)
                    result = new { result = "success", returnUrl = returnUrlResult };

                else if (loginResult.IsLockedOut)
                    result = new
                    {
                        result = "error",
                        errors = new {
                            _error = "Login failed.",
                            email = Strings.AccountLocked
                        }
                    };

                else
                {
                    var user = _userManager.FindByEmailAsync(model.Email).Result;
                    result = new
                    {
                        result = "error",
                        errors = new
                        {
                            _error = "Login failed.",
                            email = user == null ? "Email not found." : null,
                            password = user != null ? "The password that you've entered is incorrect." : null
                        }
                    };
                }
            }
            catch(Exception ex)
            {
                result = new
                {
                    result = "error",
                    errors = new
                    {
                        _error = ex.Message
                    }
                };
            }

            return Json(result);
        }
    }
}
