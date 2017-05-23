using CoreIn.App;
using CoreIn.App.ViewModels;
using CoreIn.Models.Authentication;
using CoreIn.Modules.Homeclick.Models;
using CoreIn.Modules.Homeclick.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace CoreIn.Modules.Homeclick.Controllers
{
    public class OptionGroupController : BaseController<OptionGroup, OptionGroupDetail, Strings, OptionGroupViewModel>
    {
        public OptionGroupController(UserManager<User> userManager, EntityController<OptionGroup, OptionGroupDetail, Strings, OptionGroupViewModel> entityController) : base(userManager, entityController)
        {

        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            var actionResult = context.Result as ViewResult;
            if (actionResult != null && actionResult.Model is ActionViewModel)
            {
                var actionViewModel = actionResult.Model as ActionViewModel;
                actionViewModel.Title = _entityController.GetLocalizationString("Option groups");
                actionViewModel.Scripts = new string[] { "/js/homeclick.js" };
                actionViewModel.Styles = new string[] { "/css/homeclick.css" };
                actionViewModel.Module = "Homeclick";
            }
            base.OnActionExecuted(context);
        }
    }
}
