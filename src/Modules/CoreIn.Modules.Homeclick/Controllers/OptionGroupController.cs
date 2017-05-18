using CoreIn.App.ViewModels;
using CoreIn.Commons;
using CoreIn.Commons.Form;
using CoreIn.Models.Authentication;
using CoreIn.Modules.Homeclick.Domain.OptionGroup.Form;
using CoreIn.Modules.Homeclick.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.Modules.Homeclick.Controllers
{
    public class OptionGroupController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly OptionGroupManager _optionGroupManager;
        private readonly IStringLocalizer<Strings> _localizer;

        public OptionGroupController(UserManager<User> userManager,
            IStringLocalizer<Strings> localizer,
            OptionGroupManager optionGroupManager)
        {
            _userManager = userManager;
            _localizer = localizer;
            _optionGroupManager = optionGroupManager;
        }

        public ActionResult Index()
        {
            var actionViewModel = new ActionViewModel(_localizer["Option group"], 
                module: "Homeclick", 
                scripts: new string[] { "/js/homeclick.js" },
                styles: new string[] { "/css/homeclick.css"});
            return View(actionViewModel);
        }

        public ActionResult Create()
        {
            var actionViewModel = new ActionViewModel(
                _localizer["Option group"],
                description: _localizer["Create New option group"], 
                module: "Homeclick",
                scripts: new string[] { "/js/homeclick.js" },
                styles: new string[] { "/css/homeclick.css" });
            return View(actionViewModel);
        }

        [HttpPost]
        public JsonResult Create(OptionGroupFormValues formValues)
        {
            var user = _userManager.FindByNameAsync(User.Identity.Name).Result;
            var optionGroupDetails = FormUtitities.ViewModelToEntityDetails<OptionGroupDetail, OptionGroupDetailViewModel>(formValues.Details, null, user);
            var optionGroup = new OptionGroup
            {
                Name = formValues.Details.Title,
            };

            optionGroup = _optionGroupManager.Create(optionGroup, optionGroupDetails.ToArray(), user);

            var result = new BaseAjaxResult(JsonResultState.Success, "Create successfuly.", Url.Action("update", new { id = optionGroup.Id}));
            return Json(result);
        }

        public ActionResult Update(long id)
        {
            var actionViewModel = new ActionViewModel(_localizer["Option group"],
                description: _localizer["Update option group"],
                module: "Homeclick",
                scripts: new string[] { "/js/homeclick.js" },
                styles: new string[] { "/css/homeclick.css" },
                parameters: new Dictionary<string, object>
                {
                    { "optionGroupId", id}
                });

            return View(actionViewModel);
        }

        [HttpDelete]
        public JsonResult Delete(long[] ids)
        {
            _optionGroupManager.Deletes(ids);
           return Json(new BaseAjaxResult(JsonResultState.Success, "Delete successfuly."));
        }

        [HttpPut]
        public JsonResult Update(OptionGroupFormValues formValues)
        {
            var user = _userManager.FindByNameAsync(User.Identity.Name).Result;
            var optionGroupDetails = FormUtitities.ViewModelToEntityDetails<OptionGroupDetail, OptionGroupDetailViewModel>(formValues.Details, null, user);

            var optionGroupId = long.Parse(formValues.Meta["id"]);
            var result = _optionGroupManager.Update(optionGroupId, optionGroupDetails.ToArray(), user);
            if (result > 0)
                return Json(new BaseAjaxResult(JsonResultState.Success, "Update successuly"));

            return Json(new BaseAjaxResult(JsonResultState.Failed, "Update failed"));
        }

        public JsonResult GetForm(long? optionGroupTypeId, long? optionGroupId)
        {
            return Json(_optionGroupManager.GetForm(optionGroupTypeId, optionGroupId));
        }

        public JsonResult GetTableData(Datatable datatable)
        {
            var optionGroups = _optionGroupManager.Gets();
            if (datatable.Sorting != null)
            {
                foreach (var sorting in datatable.Sorting)
                {
                    if (sorting.DESC)
                        optionGroups = sorting.DESC ? optionGroups.OrderByDescending(o => o.Details.FirstOrDefault(d => d.Field == sorting.Id).Value)
                            : optionGroups.OrderBy(o => o.Details.FirstOrDefault(d => d.Field == sorting.Id).Value);
                }
            }

            if (datatable.filtering != null)
                foreach (var filtering in datatable.filtering)
                {

                }

            var result = _optionGroupManager.ToViewModels(optionGroups.ToList());

            return Json(result);
        }
    }
}
