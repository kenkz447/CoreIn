using CoreIn.App.ViewModels;
using CoreIn.Commons;
using CoreIn.Commons.Form;
using CoreIn.Models.Authentication;
using CoreIn.Modules.Homeclick.Domain.Construction.Form;
using CoreIn.Modules.Homeclick.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.Modules.Homeclick.Controllers
{
    public class ConstructionController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly ConstructionManager _constructionManager;

        public ConstructionController(UserManager<User> userManager, ConstructionManager constructionManager)
        {
            _userManager = userManager;
            _constructionManager = constructionManager;
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
            var actionViewModel = new ActionViewModel("Create new",
                module: "Homeclick",
                scripts: new string[] { "/js/homeclick.js" },
                styles: new string[] { "/css/homeclick.css" });
            return View(actionViewModel);
        }

        [HttpPost]
        public JsonResult Create(ConstructionFormValues formValues)
        {
            var user = _userManager.FindByNameAsync(User.Identity.Name).Result;
            var projectDetails = FormUtitities.ViewModelToEntityDetails<ConstructionDetail, ConstructionDetailViewModel>(formValues.Details, null, user);
            var project = new Construction
            {
                Name = formValues.Details.Title,
            };

            project = _constructionManager.Create(project, projectDetails.ToArray(), formValues.GetTaxonomuTypeIdTaxonomyId() ,user);

            var result = new BaseAjaxResult(JsonResultState.Success, "Create successfuly.", Url.Action("update", new { id = project.Id}));
            return Json(result);
        }

        public ActionResult Update(long id)
        {
            var actionViewModel = new ActionViewModel("Update",
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
            _constructionManager.Deletes(ids);
           return Json(new BaseAjaxResult(JsonResultState.Success, "Delete successfuly."));
        }

        [HttpPut]
        public JsonResult Update(ConstructionFormValues formValues)
        {
            var user = _userManager.FindByNameAsync(User.Identity.Name).Result;
            var projectDetails = FormUtitities.ViewModelToEntityDetails<ConstructionDetail, ConstructionDetailViewModel>(formValues.Details, null, user);

            var projectId = long.Parse(formValues.Meta["id"]);
            var result = _constructionManager.Update(projectId, projectDetails.ToArray(), formValues.GetTaxonomuTypeIdTaxonomyId(), user);
            if (result > 0)
                return Json(new BaseAjaxResult(JsonResultState.Success, "Update successuly"));

            return Json(new BaseAjaxResult(JsonResultState.Failed, "Update failed"));
        }

        public JsonResult GetForm(long? projectTypeId, long? projectId)
        {
            return Json(_constructionManager.GetForm(projectTypeId, projectId));
        }

        public JsonResult GetTableData(Datatable datatable)
        {
            var projects = _constructionManager.Gets();
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

            var result = _constructionManager.ToViewModels(projects.ToList());

            return Json(result);
        }
    }
}
