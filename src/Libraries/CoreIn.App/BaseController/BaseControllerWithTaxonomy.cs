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
using Microsoft.AspNetCore.Mvc.Filters;
using CoreIn.Models;

namespace CoreIn.App
{
    public abstract class BaseControllerWithTaxonomy<TEntity, TEntityDetail, TTaxonomy, TLocalizer, TFormDetailViewModel> : BaseController<TEntity, TEntityDetail, TLocalizer, TFormDetailViewModel>
        where TEntity : BaseEntity, IEntityWithDetails<TEntityDetail>, IEntityWithTaxonomies<TTaxonomy>, new()
        where TEntityDetail : BaseEntityDetail, new()
        where TTaxonomy : BaseEntityTaxonomy, new()
        where TFormDetailViewModel : BaseEntityViewModel, new()
    {

        new EntityControllerWithTaxonomy<TEntity, TEntityDetail, TTaxonomy, TLocalizer, TFormDetailViewModel> _entityController;

        public BaseControllerWithTaxonomy(UserManager<User> userManager, 
            EntityControllerWithTaxonomy<TEntity, TEntityDetail, TTaxonomy, TLocalizer, TFormDetailViewModel> entityController) 
            : base(userManager, entityController)
        {
            _entityController = entityController;
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            var actionResult = context.Result as ViewResult;
            if (actionResult != null && actionResult.Model is ActionViewModel)
            {
                var actionViewModel = actionResult.Model as ActionViewModel;

                var entityTypeId = actionViewModel.Parameters != null && actionViewModel.Parameters.ContainsKey("entityTypeId") ? 
                    actionViewModel.Parameters["entityTypeId"] : HttpContext.Request.Query["entityTypeId"][0];

                actionViewModel.Urls = new Dictionary<string, string>()
                {
                    ["index"] = Url.Action("index", new { entityTypeId = entityTypeId }),
                    ["create"] = Url.Action("create", new { entityTypeId = entityTypeId }),
                    ["update"] = Url.Action("update")
                };
            }
        }

        public override ActionResult Index()
        {
            var actionViewModel = new ActionViewModel();
            return View(actionViewModel);
        }

        public override JsonResult GetForm(long? id, string lang = null)
        {
            var entityTypeId = long.Parse(HttpContext.Request.Query["entityTypeId"][0]);

            var form = _entityController.GetForm(id, lang);

            //form.InitialValues.Meta.Add("entityTypeId", entityTypeId.ToString());

            var taxonomyTypesViewModels = _entityController.TaxonomyHelper.GetTaxonomiesTypeViewModels(entityTypeId, true);
            form.TaxonomyTypes = taxonomyTypesViewModels.Select(o => new FormTaxonomyType(o));

            if (id != null)
            {
                foreach (var taxonomyTypeViewModel in taxonomyTypesViewModels)
                {
                    var relateTaxonomies = _entityController.TaxonomyHelper.GetTaxonomiesForEntity<TTaxonomy>(id ?? 0, taxonomyTypeViewModel.Id);
                    form.InitialValues.TaxonomyTypes.Add(taxonomyTypeViewModel.Id, relateTaxonomies.ToDictionary(o => o.TaxonomyId, o => true));
                }
            }
            return Json(form);
        }

        public override ActionResult Create()
        {
            var entityTypeId = long.Parse(HttpContext.Request.Query["entityTypeId"][0]);

            var actionViewModel = new ActionViewModel(
                parameters: new Dictionary<string, object>
                {
                    { "entityTypeId", entityTypeId }
                });
            return View(actionViewModel);
        }

        [HttpPost]
        public override JsonResult Create(FormValues<TFormDetailViewModel> formValues)
        {
            var entityDetails = FormUtitities.ViewModelToEntityDetails<TEntityDetail>(formValues.Details, formValues.Language);

            var entity = new TEntity
            {
                Name = formValues.Details.Title,
                EntityTypeId = long.Parse(formValues.Meta["entityTypeId"])
            };

            entity = _entityController.Create(entity, entityDetails.ToArray(), formValues.GetTaxonomuTypeIdTaxonomyId(), _userManager.FindByNameAsync(User.Identity.Name).Result);

            return Json(new BaseAjaxResult(JsonResultState.Success, _entityController.GetLocalizationString("Create successfuly."), Url.Action("update", new { id = entity.Id })));
        }

        public override ActionResult Update(long id, string lang = null)
        {
            var entity = _entityController.EntityHelper.Entity(id);

            var actionViewModel = new ActionViewModel(
                parameters: new Dictionary<string, object>
                {
                    { "entityTypeId", entity.EntityTypeId },
                    { "id", id},
                    { "lang", lang }
                });

            return View(actionViewModel);
        }

        [HttpPut]
        public override JsonResult Update(FormValues<TFormDetailViewModel> formValues)
        {
            var entityDetails = FormUtitities.ViewModelToEntityDetails<TEntityDetail>(formValues.Details, formValues.Language);
            var result = _entityController.Update(long.Parse(formValues.Meta["id"]), entityDetails.ToArray(), formValues.GetTaxonomuTypeIdTaxonomyId(), _userManager.FindByNameAsync(User.Identity.Name).Result);

            return Json(
                result > 0 ?
                new BaseAjaxResult(JsonResultState.Success, "Update successuly") :
                new BaseAjaxResult(JsonResultState.Failed, "Update failed"));
        }

        public override JsonResult GetTableData(DataRequest dataRequest)
        {
            var filterResult = _entityController.GetEntities(dataRequest);
            return Json(filterResult);
        }

        private FormValues<TFormDetailViewModel> GetViewModelOfSingle(TEntity entity)
        {
            var result = _entityController.GetEntityValues(entity.Id, GetCurrentLanguage());

            var entityTypeId = long.Parse(result.Meta["entityTypeId"]);
            var entityId = long.Parse(result.Meta["id"]);

            var taxonomyTypeViewModels = _entityController.TaxonomyHelper.GetTaxonomiesTypeViewModels(entityTypeId, true);

            foreach (var taxonomyTypeViewModel in taxonomyTypeViewModels)
            {
                var relateTaxonomies = _entityController.TaxonomyHelper.GetTaxonomiesForEntity<TTaxonomy>(entityId, taxonomyTypeViewModel.Id).Select(o => o.TaxonomyId);
                var taxonomyViewModels = taxonomyTypeViewModel.Taxonomies.Where(o => relateTaxonomies.Contains(o.Id));
                taxonomyTypeViewModel.Taxonomies = taxonomyViewModels;
            }

            result.TaxonomyTypeViewModels = taxonomyTypeViewModels;

            return result;
        }

        public override JsonResult GetSingle(string entityName)
        {
            var entity = _entityController.EntityHelper.Entity(entityName);

            if (entity == null)
                return Json(null);

            var result = GetViewModelOfSingle(entity);

            return Json(result);
        }
            

        public override JsonResult GetNextAndPreEntity(long currentEntityId)
        {
            var entity = _entityController.EntityHelper.Entity(currentEntityId);

            if (entity != null)
            {
                var nextEntity = _entityController.EntityHelper.Entities().Where(o => o.EntityTypeId == entity.EntityTypeId && o.Created > entity.Created).OrderBy(o => o.Created).FirstOrDefault();
                var preEntity = _entityController.EntityHelper.Entities().Where(o => o.EntityTypeId == entity.EntityTypeId && o.Created < entity.Created).OrderByDescending(o => o.Created).FirstOrDefault();
                var currentLanguage = GetCurrentLanguage();

                var result = new
                {
                    next = nextEntity != null ? GetViewModelOfSingle(nextEntity) : null,
                    pre = preEntity != null ? GetViewModelOfSingle(preEntity): null
                };
                return Json(result);
            }
            return Json(null);
        }

        public JsonResult GetNextAndPreEntityByTaxonomies(long currentEntityId, long[] taxonomies)
        {
            var entity = _entityController.EntityHelper.Entity(currentEntityId);

            if (entity != null)
            {
                var nextEntity = _entityController.EntityHelper.Entities().Where(o => 
                        o.EntityTypeId == entity.EntityTypeId && o.Created > entity.Created && 
                        o.Taxonomies.FirstOrDefault(t => taxonomies.Contains(t.TaxonomyId)) != null
                    ).OrderBy(o => o.Created).FirstOrDefault();

                var preEntity = _entityController.EntityHelper.Entities().Where(o => 
                        o.EntityTypeId == entity.EntityTypeId && o.Created < entity.Created && 
                        o.Taxonomies.FirstOrDefault(t => taxonomies.Contains(t.TaxonomyId)) != null
                    ).OrderByDescending(o => o.Created).FirstOrDefault();

                var currentLanguage = GetCurrentLanguage();

                var result = new
                {
                    next = nextEntity != null ? GetViewModelOfSingle(nextEntity) : null,
                    pre = preEntity != null ? GetViewModelOfSingle(preEntity) : null
                };
                return Json(result);
            }
            return Json(null);
        }
    }
}
