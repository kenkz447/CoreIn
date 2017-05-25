using CoreIn.App.ViewModels;
using CoreIn.Commons;
using CoreIn.Commons.Form;
using CoreIn.Commons.ViewModels;
using CoreIn.Models.Authentication;
using CoreIn.Models.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.App
{
    public abstract class BaseController<TEntity, TEntityDetail, TLocalizer, TFormDetailViewModel> : Controller
        where TEntity : BaseEntity, new()
        where TEntityDetail : BaseEntityDetail, new()
        where TFormDetailViewModel : BaseEntityViewModel, new()
    {
        public readonly UserManager<User> _userManager;
        public readonly EntityController<TEntity, TEntityDetail, TLocalizer, TFormDetailViewModel> _entityController;

        public BaseController(UserManager<User> userManager, EntityController<TEntity, TEntityDetail, TLocalizer, TFormDetailViewModel> entityController)
        {
            _userManager = userManager;
            _entityController = entityController;
        }

        public virtual ActionResult Index()
        {
            var actionViewModel = new ActionViewModel();
            return View(actionViewModel);
        }

        public virtual ActionResult Create()
        {
            var actionViewModel = new ActionViewModel();
            return View(actionViewModel);
        }

        [HttpPost]
        public virtual JsonResult Create(FormValues<TFormDetailViewModel> formValues)
        {
            var entityDetails = FormUtitities.ViewModelToEntityDetails<TEntityDetail, TFormDetailViewModel>(formValues.Details, formValues.Language);

            var entity = new TEntity
            {
                Name = formValues.Details.Title,
            };

            entity = _entityController.Create(entity, entityDetails.ToArray(), _userManager.FindByNameAsync(User.Identity.Name).Result);

            return Json(new BaseAjaxResult(JsonResultState.Success, _entityController.GetLocalizationString("Create successfuly."), Url.Action("update", new { id = entity.Id })));
        }

        public virtual ActionResult Update(long id, string lang = null)
        {
            var actionViewModel = new ActionViewModel(
                parameters: new Dictionary<string, object>
                {
                    { "id", id},
                    { "lang", lang}
                });

            return View(actionViewModel);
        }

        [HttpPut]
        public virtual JsonResult Update(FormValues<TFormDetailViewModel> formValues)
        {
            var entityDetails = FormUtitities.ViewModelToEntityDetails<TEntityDetail, TFormDetailViewModel>(formValues.Details, formValues.Language);

            var result = _entityController.Update(long.Parse(formValues.Meta["id"]), entityDetails.ToArray(), _userManager.FindByNameAsync(User.Identity.Name).Result);

            return Json(
                result > 0 ?
                new BaseAjaxResult(JsonResultState.Success, "Update successuly") :
                new BaseAjaxResult(JsonResultState.Failed, "Update failed"));
        }

        [HttpDelete]
        public JsonResult Delete(long[] ids)
        {
            _entityController.Deletes(ids);
            return Json(new BaseAjaxResult(JsonResultState.Success, _entityController.GetLocalizationString("Delete successfuly.")));
        }

        public virtual JsonResult GetForm(long? id, string lang = null)
            => Json(_entityController.GetForm(id, lang));

        public JsonResult GetTableData(Datatable datatable)
        {
            var entities = _entityController.Gets();
            if (datatable.Sorting != null)
            {
                foreach (var sorting in datatable.Sorting)
                {
                    //if (sorting.DESC)
                    //    entities = sorting.DESC ? entities.OrderByDescending(o => o.Details.FirstOrDefault(d => d.Field == sorting.Id).Value)
                    //        : entities.OrderBy(o => o.Details.FirstOrDefault(d => d.Field == sorting.Id).Value);
                }
            }

            if (datatable.filtering != null)
                foreach (var filtering in datatable.filtering)
                {

                }

            var result = _entityController.ToViewModels(entities.ToList());

            return Json(result);
        }
    }
}
