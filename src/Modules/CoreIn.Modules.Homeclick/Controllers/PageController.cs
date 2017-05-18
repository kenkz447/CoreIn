using CoreIn.App.ViewModels;
using CoreIn.Commons;
using CoreIn.Commons.Form;
using CoreIn.Models.Authentication;
using CoreIn.Modules.Homeclick.Domain.Page.Form;
using CoreIn.Modules.Homeclick.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.Modules.Homeclick.Controllers
{
    public class PageController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly PageManager _pageManager;

        public PageController(UserManager<User> userManager, PageManager pageManager)
        {
            _userManager = userManager;
            _pageManager = pageManager;
        }

        public ActionResult Index()
        {
            var actionViewModel = new ActionViewModel("All Page", 
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
        public JsonResult Create(PageFormValues formValues)
        {
            var user = _userManager.FindByNameAsync(User.Identity.Name).Result;
            var projectDetails = FormUtitities.ViewModelToEntityDetails<PageDetail, PageDetailViewModel>(formValues.Details, null, user);
            var project = new Page
            {
                Name = formValues.Details.Title,
            };

            project = _pageManager.Create(project, projectDetails.ToArray(),user);

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
            _pageManager.Deletes(ids);
           return Json(new BaseAjaxResult(JsonResultState.Success, "Delete successfuly."));
        }

        [HttpPut]
        public JsonResult Update(PageFormValues formValues)
        {
            var user = _userManager.FindByNameAsync(User.Identity.Name).Result;
            var projectDetails = FormUtitities.ViewModelToEntityDetails<PageDetail, PageDetailViewModel>(formValues.Details, null, user);

            var projectId = long.Parse(formValues.Meta["id"]);
            var result = _pageManager.Update(projectId, projectDetails.ToArray(), user);
            if (result > 0)
                return Json(new BaseAjaxResult(JsonResultState.Success, "Update successuly"));

            return Json(new BaseAjaxResult(JsonResultState.Failed, "Update failed"));
        }

        public JsonResult GetForm(long? projectId)
        {
            return Json(_pageManager.GetForm(projectId));
        }

        public JsonResult GetTableData(Datatable datatable)
        {
            var projects = _pageManager.Gets();
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

            var result = _pageManager.ToViewModels(projects.ToList());

            return Json(result);
        }
    }
}
