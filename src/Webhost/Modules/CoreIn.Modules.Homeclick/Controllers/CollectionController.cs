using CoreIn.App.ViewModels;
using CoreIn.Commons;
using CoreIn.Commons.Form;
using CoreIn.Models.Authentication;
using CoreIn.Modules.Homeclick.Domain.Project.Form;
using CoreIn.Modules.Homeclick.Models;
using CoreIn.Modules.Homeclick.Models.ViewModel.Collection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.Modules.Homeclick.Controllers
{
    public class CollectionController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly CollectionManager _collectionManager;

        public CollectionController(UserManager<User> userManager, CollectionManager collectionManager)
        {
            _userManager = userManager;
            _collectionManager = collectionManager;
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
        public JsonResult Create(CollectionFormValues formValues)
        {
            var user = _userManager.FindByNameAsync(User.Identity.Name).Result;
            var projectDetails = FormUtitities.ViewModelToEntityDetails<CollectionDetail, CollectionDetailViewModel>(formValues.Details, null, user);
            var project = new Collection
            {
                Name = formValues.Details.Title,
            };

            project = _collectionManager.CreateProject(project, projectDetails.ToArray(), user);

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
            _collectionManager.DeleteProjects(ids);
           return Json(new BaseAjaxResult(JsonResultState.Success, "delete successfuly."));
        }

        [HttpPut]
        public JsonResult Update(CollectionFormValues formValues)
        {
            var user = _userManager.FindByNameAsync(User.Identity.Name).Result;
            var projectDetails = FormUtitities.ViewModelToEntityDetails<CollectionDetail, CollectionDetailViewModel>(formValues.Details, null, user);

            var projectId = long.Parse(formValues.Meta["id"]);
            var result = _collectionManager.UpdateProject(projectId, projectDetails.ToArray(), user);
            if (result > 0)
                return Json(new BaseAjaxResult(JsonResultState.Success, "Update successuly"));

            return Json(new BaseAjaxResult(JsonResultState.Failed, "Update failed"));
        }

        public JsonResult GetNewProjectForm(long? projectTypeId, long? projectId)
        {
            return Json(_collectionManager.GetForm(projectTypeId, projectId));
        }

        public JsonResult GetTableData(Datatable datatable)
        {
            var projects = _collectionManager.GetCollections();
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

            var result = _collectionManager.ToViewModels(projects.ToList());

            return Json(result);
        }
    }
}
