using CoreIn.App;
using CoreIn.App.ViewModels;
using CoreIn.Models.Authentication;
using CoreIn.Modules.Post;
using CoreIn.Modules.Post.Models;
using CoreIn.Modules.Post.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace CoreIn.Modules.Homeclick.Controllers
{
    public class PostController : BaseControllerWithTaxonomy<PostEntity, PostEntityDetail, PostEntityTaxonomy, Strings, PostEntityViewModel>
    {
        public PostController(UserManager<User> userManager,
            EntityControllerWithTaxonomy<PostEntity, PostEntityDetail, PostEntityTaxonomy, Strings, PostEntityViewModel> entityController)
            : base(userManager, entityController)
        {

        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            var actionResult = context.Result as ViewResult;
            if (actionResult != null && actionResult.Model is ActionViewModel)
            {
                var actionViewModel = actionResult.Model as ActionViewModel;
                actionViewModel.Title = _entityController.GetLocalizationString("Posts");
                actionViewModel.Scripts = new string[] {"/js/post.js" };
                actionViewModel.Module = "Corein";
            }
            base.OnActionExecuted(context);
        }
    }
}
