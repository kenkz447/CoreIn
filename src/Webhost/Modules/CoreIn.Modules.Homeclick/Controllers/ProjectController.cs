using CoreIn.App.ViewModels;
using CoreIn.Commons;
using CoreIn.Commons.Form;
using CoreIn.Models.Authentication;
using CoreIn.Modules.Homeclick.Domain.Project.Form;
using CoreIn.Modules.Homeclick.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CoreIn.Modules.Homeclick.Controllers
{
    public class ProjectController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly ProjectManager _projectManager;

        public ProjectController(UserManager<User> userManager, ProjectManager projectManager)
        {
            _userManager = userManager;
            _projectManager = projectManager;
        }

        public ActionResult Index()
        {
            var actionViewModel = new ActionViewModel("Index");
            return View(actionViewModel);
        }

        public ActionResult Create()
        {
            var actionViewModel = new ActionViewModel("Create new project");
            return View(actionViewModel);
        }

        [HttpPost]
        public JsonResult Create(ProjectFormValues formValues)
        {
            var user = _userManager.FindByNameAsync(User.Identity.Name).Result;
            var projectDetails = FormUtitities.ViewModelToEntityDetails<ProjectDetail, ProjectDetailsViewModel>(formValues.Details, null, user);
            var project = new Project
            {
                Name = formValues.Details.Title,
            };

            project = _projectManager.CreateProject(project, projectDetails.ToArray(), user);

            var result = new BaseAjaxResult(JsonResultState.Success, "New project was created!");
            return Json(result);
        }

        public JsonResult GetNewProjectForm()
        {
            return Json(_projectManager.GetForm(null));
        }

        public JsonResult GetTableData(Datatable datatable)
        {
            var projects = _projectManager.GetProjects();
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
