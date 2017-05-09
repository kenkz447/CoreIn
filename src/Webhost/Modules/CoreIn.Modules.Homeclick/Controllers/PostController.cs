using CoreIn.App.ViewModels;
using CoreIn.Commons;
using CoreIn.Commons.Form;
using CoreIn.Models.Authentication;
using CoreIn.Modules.Homeclick.Domain.Post.Form;
using CoreIn.Modules.Homeclick.Domain.Project.Form;
using CoreIn.Modules.Homeclick.Models;
using CoreIn.Modules.Homeclick.Models.ViewModel.Collection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.Modules.Homeclick.Controllers
{
    public class PostController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly PostManager _postManager;

        public PostController(UserManager<User> userManager, PostManager postManager)
        {
            _userManager = userManager;
            _postManager = postManager;
        }

        public ActionResult Index()
        {
            var actionViewModel = new ActionViewModel("Index", 
                module: "Homeclick", 
                scripts: new string[] { "/js/homeclick.js" },
                styles: new string[] { "/css/homeclick.css"});
            return View(actionViewModel);
        }

        public ActionResult Create()
        {
            var actionViewModel = new ActionViewModel("Create a new collection",
                module: "Homeclick",
                scripts: new string[] { "/js/homeclick.js" },
                styles: new string[] { "/css/homeclick.css" });
            return View(actionViewModel);
        }

        [HttpPost]
        public JsonResult Create(PostFormValues formValues)
        {
            var user = _userManager.FindByNameAsync(User.Identity.Name).Result;
            var projectDetails = FormUtitities.ViewModelToEntityDetails<PostDetail, PostDetailsViewModel>(formValues.Details, null, user);
            var project = new Post
            {
                Name = formValues.Details.Title,
            };
            var taxonomyTypeTaxonomies = formValues.TaxonomyTypes?.ToDictionary(o => o.Key, o => o.Value.Keys.ToArray());

            project = _postManager.CreatePost(project, projectDetails.ToArray(), taxonomyTypeTaxonomies, user);

            var result = new BaseAjaxResult(JsonResultState.Success, "New project was created!", Url.Action("update", new { id = project.Id}));
            return Json(result);
        }

        public ActionResult Update(long id)
        {
            var actionViewModel = new ActionViewModel("Update the project",
                module: "Homeclick",
                scripts: new string[] { "/js/homeclick.js" },
                styles: new string[] { "/css/homeclick.css" },
                parameters: new Dictionary<string, object>
                {
                    { "projectId", id}
                });

            return View(actionViewModel);
        }

        [HttpDelete]
        public JsonResult Delete(long[] ids)
        {
            _postManager.DeletePosts(ids);
           return Json(new BaseAjaxResult(JsonResultState.Success, "delete successfuly."));
        }

        [HttpPut]
        public JsonResult Update(PostFormValues formValues)
        {
            var user = _userManager.FindByNameAsync(User.Identity.Name).Result;
            var projectDetails = FormUtitities.ViewModelToEntityDetails<PostDetail, PostDetailsViewModel>(formValues.Details, null, user);

            var projectId = long.Parse(formValues.Meta["id"]);
            var result = _postManager.UpdatePost(projectId, projectDetails.ToArray(), user);
            if (result > 0)
                return Json(new BaseAjaxResult(JsonResultState.Success, "Update successuly"));

            return Json(new BaseAjaxResult(JsonResultState.Failed, "Update failed"));
        }

        public JsonResult GetNewProjectForm(long? projectId)
        {
            return Json(_postManager.GetForm(projectId));
        }

        public JsonResult GetTableData(Datatable datatable)
        {
            var projects = _postManager.GetPosts();
            if (datatable.Sorting != null)
            {
                foreach (var sorting in datatable.Sorting)
                {
                    if (sorting.DESC)
                        projects = sorting.DESC ? projects.OrderByDescending(o => o.Details.FirstOrDefault(d => d.Field == sorting.Id).Value)
                            : projects.OrderBy(o => o.Details.FirstOrDefault(d => d.Field == sorting.Id).Value);
                }
            }

            if (datatable.filtering != null)
                foreach (var filtering in datatable.filtering)
                {

                }

            var result = _postManager.ToViewModels(projects.ToList());

            return Json(result);
        }
    }
}
