using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CoreIn.EntityCore;
using CoreIn.Commons.Form;
using Microsoft.AspNetCore.Identity;
using CoreIn.Models.Authentication;
using CoreIn.Commons;
using Microsoft.AspNetCore.Authorization;
using CoreIn.Resources.ConstantKeys;
using System.Net;

namespace CoreIn.Modules.TaxonomyUI.Controllers
{
    [Authorize]
    public class TaxonomyUI : Controller
    {
        private readonly ITaxonomyHelper _taxonomyHelper;
        private readonly UserManager<User> _userManager;

        public TaxonomyUI(ITaxonomyHelper taxonomyHelper, UserManager<User> userNamager)
        {
            _taxonomyHelper = taxonomyHelper;
            _userManager = userNamager;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult NewTaxonomy(FormValues formValues)
        {
            var taxonomyTypeId = formValues.Meta[AppKey.TaxonomyTypeId];
            long? parentId = null;
            if (formValues.Meta.ContainsKey(AppKey.ParentId))
                parentId = Int64.Parse(formValues.Meta[AppKey.ParentId]);

            var user = _userManager.FindByNameAsync(User.Identity.Name).Result;
            var taxonomy = _taxonomyHelper.CreateTaxonomy(Int64.Parse(taxonomyTypeId), parentId, null, formValues.Details, user);
            var taxonomyViewModel = _taxonomyHelper.TaxonomyToViewModel(taxonomy);
            return Json(taxonomyViewModel);
        }

        public JsonResult GetTaxonomyTypes()
        {
            var result = _taxonomyHelper.GetTaxonomiesTypeViewModels();
            return Json(result);
        }

        public JsonResult GetTaxonomyForm(long taxonomyTypeId)
        {
            var form = _taxonomyHelper.GetForm(taxonomyTypeId);
            return Json(form);
        }

        public JsonResult GetTaxonomies(long taxonomyTypeId)
        {
            var taxonomies = _taxonomyHelper.GetTaxonomies(taxonomyTypeId);
            var result = _taxonomyHelper.TaxonomiesToViewModels(taxonomies);
            return Json(result);
        }

        /// <summary>
        /// Xóa taxonomies, trả về danh sách taxonomy còn lại sau khi thực hiện xóa
        /// </summary>
        /// <param name="taxonomyIds">Danh sách id của những taxonomy cần xóa</param>
        /// <returns></returns>
        [HttpDelete]
        public JsonResult DeleteTaxonomies(long[] taxonomyIds)
        {
            var deleteResult = new List<long>();

            if (taxonomyIds == null)
                return Json(new BaseAjaxResult(JsonResultState.Success, "Nothing happend!"));

            var taxonomyTypeId = _taxonomyHelper.GetTaxonomyTypeOf(taxonomyIds.First()).Id;
            foreach (var taxonomyId in taxonomyIds)
            {
                if (_taxonomyHelper.DeleteTaxonomy(taxonomyId) != 0)
                    deleteResult.Add(taxonomyId);
            }

            return GetTaxonomies(taxonomyTypeId);
        }

        [HttpPut]
        public JsonResult UpdateTaxonomy(FormValues formValues)
        {
            var id = formValues.Meta["id"];
            var parentId = formValues.Meta["parentId"];

            var user = _userManager.FindByNameAsync(User.Identity.Name).Result;
            var taxonomy = _taxonomyHelper.UpdateTaxonomy(Int64.Parse(parentId), Int64.Parse(id), formValues.Details, user);
            var taxonomyViewModel = _taxonomyHelper.TaxonomyToViewModel(taxonomy);

            var result = new BaseAjaxResult(JsonResultState.Success, "The taxonomy was deleted.", taxonomyViewModel);
            return Json(taxonomyViewModel);
        }

        [HttpPut]
        public JsonResult UpdateTaxonomies(TaxonomyViewModel[] viewModels)
        {
            var result = new List<TaxonomyViewModel>();
            if (viewModels != null)
            {
                var user = _userManager.FindByNameAsync(User.Identity.Name).Result;
                foreach (var viewModel in viewModels)
                {
                    try
                    {
                       var taxonomy = _taxonomyHelper.UpdateTaxonomy(viewModel.ParentId, viewModel.Id, null, user);
                        result.Add(_taxonomyHelper.TaxonomyToViewModel(taxonomy));
                    }
                    catch (Exception)
                    {
                        result.Add(viewModel);
                        continue;
                    }
    
                }
            }

            return Json(new BaseAjaxResult(JsonResultState.Success, "Update successfuly.", result));
        }
    }
}
