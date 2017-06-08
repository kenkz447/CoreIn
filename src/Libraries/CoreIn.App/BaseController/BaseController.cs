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
        where TEntity : BaseEntity, IEntityWithDetails<TEntityDetail>, new()
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
            var entityDetails = FormUtitities.ViewModelToEntityDetails<TEntityDetail>(formValues.Details, formValues.Language);

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
            var entityDetails = FormUtitities.ViewModelToEntityDetails<TEntityDetail>(formValues.Details, formValues.Language);

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

        [HttpPost]
        public virtual JsonResult GetTableData(DataRequest dataRequest)
        {
            var filterResult = _entityController.GetEntities(dataRequest);
            var results = _entityController.ToViewModels(filterResult.ToList());
            return Json(results);
        }
    }
}
