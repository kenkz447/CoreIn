using CoreIn.App.ViewModels;
using CoreIn.Commons;
using CoreIn.Commons.Form;
using CoreIn.Models.Authentication;
using CoreIn.Modules.Homeclick.Domain.OptionGroup.Form;
using CoreIn.Modules.Homeclick.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.Modules.Homeclick.Controllers
{
    public class OptionGroupController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly OptionGroupManager _projectManager;

        public OptionGroupController(UserManager<User> userManager, OptionGroupManager projectManager)
        {
            _userManager = userManager;
            _projectManager = projectManager;
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
            var actionViewModel = new ActionViewModel("Create a new option group",
                module: "Homeclick",
                scripts: new string[] { "/js/homeclick.js" },
                styles: new string[] { "/css/homeclick.css" });
            return View(actionViewModel);
        }

        [HttpPost]
        public JsonResult Create(OptionGroupFormValues formValues)
        {
            var user = _userManager.FindByNameAsync(User.Identity.Name).Result;
            var projectDetails = FormUtitities.ViewModelToEntityDetails<OptionGroupDetail, OptionGroupDetailViewModel>(formValues.Details, null, user);
            var project = new OptionGroup
            {
                Name = formValues.Details.Title,
            };

            project = _projectManager.Create(project, projectDetails.ToArray(), user);

            var result = new BaseAjaxResult(JsonResultState.Success, "Create successfuly.", Url.Action("update", new { id = project.Id}));
            return Json(result);
        }

        public ActionResult Update(long id)
        {
            var actionViewModel = new ActionViewModel("Update the option group",
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
            _projectManager.Deletes(ids);
           return Json(new BaseAjaxResult(JsonResultState.Success, "Delete successfuly."));
        }

        [HttpPut]
        public JsonResult Update(OptionGroupFormValues formValues)
        {
            var user = _userManager.FindByNameAsync(User.Identity.Name).Result;
            var projectDetails = FormUtitities.ViewModelToEntityDetails<OptionGroupDetail, OptionGroupDetailViewModel>(formValues.Details, null, user);

            var projectId = long.Parse(formValues.Meta["id"]);
            var result = _projectManager.Update(projectId, projectDetails.ToArray(), user);
            if (result > 0)
                return Json(new BaseAjaxResult(JsonResultState.Success, "Update successuly"));

            return Json(new BaseAjaxResult(JsonResultState.Failed, "Update failed"));
        }

        public JsonResult GetForm(long? projectTypeId, long? projectId)
        {
            return Json(_projectManager.GetForm(projectTypeId, projectId));
        }

        public JsonResult GetTableData(Datatable datatable)
        {
            var projects = _projectManager.Gets();
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

            var result = _projectManager.ToViewModels(projects.ToList());

            return Json(result);
        }
    }
}
