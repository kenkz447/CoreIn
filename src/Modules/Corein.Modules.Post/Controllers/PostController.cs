using CoreIn.App.ViewModels;
using CoreIn.Models.Authentication;
using CoreIn.Modules.Post.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using CoreIn.App;
using CoreIn.Modules.Post.ViewModels;

namespace CoreIn.Modules.Post.Controllers
{
    public class PostController : BaseController<PostEntity, PostEntityDetail, Strings, PostEntityViewModel>
    {
        public PostController(UserManager<User> userManager, EntityController<PostEntity, PostEntityDetail, Strings, PostEntityViewModel> entityController) : base(userManager, entityController)
        {

        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            var actionResult = context.Result as ViewResult;
            if (actionResult != null && actionResult.Model is ActionViewModel)
            {
                var actionViewModel = actionResult.Model as ActionViewModel;
                actionViewModel.Title = _entityController.GetLocalizationString("Posts");
                actionViewModel.Scripts = new string[] { "/js/post.js" };
                actionViewModel.Module = "Corein";
            }
            base.OnActionExecuted(context);
        }
    }
}
