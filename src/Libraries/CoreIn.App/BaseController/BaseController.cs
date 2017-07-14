using CoreIn.App.ViewModels;
using CoreIn.Commons;
using CoreIn.Commons.Form;
using CoreIn.Commons.ViewModels;
using CoreIn.Models.Authentication;
using CoreIn.Models.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.App
{
    [Authorize]
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

        public string GetCurrentLanguage()
            => Request.Cookies[".AspNetCore.Culture"].Split('|')[0].Split('=')[1];

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            var actionResult = context.Result as ViewResult;
            if (actionResult != null && actionResult.Model is ActionViewModel)
            {
                var actionViewModel = actionResult.Model as ActionViewModel;
                actionViewModel.Urls = new Dictionary<string, string>()
                {
                    ["index"] = Url.Action("index"),
                    ["create"] = Url.Action("create"),
                    ["update"] = Url.Action("update")
                };
            }
            base.OnActionExecuted(context);
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
        [AllowAnonymous]
        public virtual JsonResult GetTableData(DataRequest dataRequest)
        {
            var filterResult = _entityController.GetEntities(dataRequest);
            var totalCountBeforeSkipAndTake = filterResult.Count();

            filterResult = filterResult.Skip((dataRequest.Page - 1) * dataRequest.PageSize);
            filterResult = filterResult.Take(dataRequest.PageSize);

            var result = new EntitiesResult<TEntity>
            {
                Entities = _entityController.ToViewModels(filterResult.ToList()),
                TotalCount = totalCountBeforeSkipAndTake
            };

            return Json(result);
        }

        [AllowAnonymous]
        public int GetTotalEntitiesCount()
            => _entityController.EntityHelper.Entities().Count();

        [AllowAnonymous]
        public JsonResult GetRandomEntity(int count)
        {
            var filterResult = _entityController.GetRandomEntities(count);
            var results = _entityController.ToViewModels(filterResult.ToList());
            return Json(results);
        }

        [AllowAnonymous]
        public virtual JsonResult GetSingle(string entityName)
        {
            var result = _entityController.GetEntityValues(entityName, GetCurrentLanguage());
            return Json(result);
        }

        [AllowAnonymous]
        public virtual JsonResult GetMulti(long[] entityIds)
        {
            var entities = _entityController.EntityHelper.Entities().Where(o => entityIds.Contains(o.Id)).ToList();
            var result = new List<object>();

            foreach (var entity in entities)
                result.Add(_entityController.GetEntityValues(entity.Name, GetCurrentLanguage()));

            return Json(result);
        }

        [AllowAnonymous]
        public virtual JsonResult GetNextAndPreEntity(long currentEntityId)
        {
            var entity = _entityController.EntityHelper.Entity(currentEntityId);

            if (entity != null)
            {
                var nextEntity = _entityController.EntityHelper.Entities().Where(o => o.EntityTypeId == entity.EntityTypeId && o.Created > entity.Created).OrderBy(o => o.Created).FirstOrDefault();
                var preEntity = _entityController.EntityHelper.Entities().Where(o => o.EntityTypeId == entity.EntityTypeId && o.Created < entity.Created).OrderByDescending(o => o.Created).FirstOrDefault();
                var currentLanguage = GetCurrentLanguage();

                var result = new
                {
                    next = nextEntity != null ? _entityController.GetEntityValues(nextEntity.Id, currentLanguage) : null,
                    pre = preEntity != null ? _entityController.GetEntityValues(preEntity.Id, currentLanguage) : null
                };
                return Json(result);
            }
            return Json(null);
        }
    }
}