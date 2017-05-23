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
    public class CollectionController : BaseController<Collection, CollectionDetail, Strings, CollectionViewModel>
    {
        public CollectionController(UserManager<User> userManager, EntityController<Collection, CollectionDetail, Strings, CollectionViewModel> entityController) : base(userManager, entityController)
        {

        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            var actionResult = context.Result as ViewResult;
            if (actionResult != null && actionResult.Model is ActionViewModel)
            {
                var actionViewModel = actionResult.Model as ActionViewModel;
                actionViewModel.Title = _entityController.GetLocalizationString("Collections");
                actionViewModel.Scripts = new string[] { "/js/homeclick.js" };
                actionViewModel.Styles = new string[] { "/css/homeclick.css" };
                actionViewModel.Module = "Homeclick";
            }
            base.OnActionExecuted(context);
        }
    }
}
