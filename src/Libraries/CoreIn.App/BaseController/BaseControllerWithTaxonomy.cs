﻿using CoreIn.App.ViewModels;
using CoreIn.Commons;
using CoreIn.Commons.Form;
using CoreIn.Commons.ViewModels;
using CoreIn.EntityCore;
using CoreIn.Models.Authentication;
using CoreIn.Models.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.App
{
    public abstract class BaseControllerWithTaxonomy<TEntity, TEntityDetail, TTaxonomy, TLocalizer, TFormDetailViewModel> : BaseController<TEntity, TEntityDetail, TLocalizer, TFormDetailViewModel>
        where TEntity : BaseEntity, new()
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

        public override JsonResult GetForm(long? id, string lang = null)
        {
            var entityTypeId = long.Parse(HttpContext.Request.Query["entityTypeId"][0]);

            var form = _entityController.GetForm(id, lang);
            var taxonomyTypesViewModels = _entityController.TaxonomyHelper.GetTaxonomiesTypeViewModels(entityTypeId, true);
            form.TaxonomyTypes = taxonomyTypesViewModels.Select(o => new FormTaxonomyType(o));
            form.InitialValues.Meta.Add("entityTypeId", entityTypeId.ToString());

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
            var entityDetails = FormUtitities.ViewModelToEntityDetails<TEntityDetail, TFormDetailViewModel>(formValues.Details, formValues.Language);

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
                    { "lang", lang}
                });

            return View(actionViewModel);
        }

        [HttpPut]
        public override JsonResult Update(FormValues<TFormDetailViewModel> formValues)
        {
            var entityDetails = FormUtitities.ViewModelToEntityDetails<TEntityDetail, TFormDetailViewModel>(formValues.Details, formValues.Language);
            var result = _entityController.Update(long.Parse(formValues.Meta["id"]), entityDetails.ToArray(), formValues.GetTaxonomuTypeIdTaxonomyId(), _userManager.FindByNameAsync(User.Identity.Name).Result);

            return Json(
                result > 0 ?
                new BaseAjaxResult(JsonResultState.Success, "Update successuly") :
                new BaseAjaxResult(JsonResultState.Failed, "Update failed"));
        }
    }
}
