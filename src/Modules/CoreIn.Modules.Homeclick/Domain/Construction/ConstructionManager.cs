using CoreIn.Commons;
using CoreIn.Commons.EntityHelper;
using CoreIn.Commons.Form;
using CoreIn.EntityCore;
using CoreIn.Media.MediaHelper;
using CoreIn.Models.Authentication;
using CoreIn.Modules.Homeclick.Domain.Construction.Form;
using CoreIn.Modules.Homeclick.Models;
using Microsoft.Extensions.Localization;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.Modules.Homeclick
{
    public class ConstructionManager
    {
        private readonly CoreInDbContext _dbContext;
        private readonly IEntityHelper<Construction, ConstructionDetail> _constructionEntityHelper;
        private readonly IMediaHelper _mediaHelper;
        private readonly ITaxonomyHelper _taxonomyHelper;
        private readonly EntityTypeManager _entityTypeManager;
        private readonly IStringLocalizer<Strings> _localizer;

        public ConstructionManager(CoreInDbContext dbContext, 
            IMediaHelper mediaHelper, 
            IEntityHelper<Construction, ConstructionDetail> constructionEntityHelper,
            ITaxonomyHelper taxonomyHelper,
            EntityTypeManager entityTypeManager,
            IStringLocalizer<Strings> localizer)
        {
            _dbContext = dbContext;

            _mediaHelper = mediaHelper;

            _taxonomyHelper = taxonomyHelper;
            _entityTypeManager = entityTypeManager;

            _constructionEntityHelper = constructionEntityHelper;
            _constructionEntityHelper.SetContext(_dbContext);
            _localizer = localizer;
        }

        public IQueryable<Construction> Gets()
        {
            return _constructionEntityHelper.Entities();
        }
             
        public DynamicForm GetForm(long? entityTypeId, long? entityId)
        {
            var taxonomyTypesViewModels = _taxonomyHelper.GetTaxonomiesTypeViewModels(_entityTypeManager.Construction.Id, true);

            var form = new DynamicForm
            {
                Meta = new List<FormField>
                {
                    new FormField
                    {
                        Name = "entityTypeId",
                        Status = FieldStatus.Hidden,
                    }
                },
                Details = FormUtitities.ViewModelTypeToFormField(typeof(ConstructionDetailViewModel), _localizer),
                TaxonomyTypes = taxonomyTypesViewModels.Select(o => new FormTaxonomyType(o))
            };

            if (entityId != null)
            {

                var entity = _constructionEntityHelper.Entity(entityId ?? 0);
                var details = _constructionEntityHelper.GetDetails(entity).ToList();

                var formValues = new ConstructionFormValues()
                {
                    Meta = new Dictionary<string, string>() { { "id", entityId.ToString() } },
                    Details = FormUtitities.EntityDetailsToFieldValues<ConstructionDetail, ConstructionDetailViewModel>(details)
                };

                foreach (var taxonomyTypeViewModel in taxonomyTypesViewModels)
                {
                    var relateTaxonomies = _taxonomyHelper.GetTaxonomiesForEntity<ConstructionTaxonomy>(entity.Id, taxonomyTypeViewModel.Id);
                    formValues.TaxonomyTypes.Add(taxonomyTypeViewModel.Id, relateTaxonomies.ToDictionary(o => o.TaxonomyId, o => true));
                }

                form.InitialValues = formValues;
            }

            return form;
        }

        public Construction Create(Construction newEntity, ConstructionDetail[] details, Dictionary<long, long[]> taxonomyTypeIdTaxonomyIds = null, User user = null)
        {
            newEntity.Name = _constructionEntityHelper.GenerateEntityName(newEntity.Name);
            if (newEntity.EntityTypeId == null)
                newEntity.EntityTypeId = _entityTypeManager.Construction.Id;

            var entity = _constructionEntityHelper.Add(newEntity, user);
            if (details != null)
                entity.Details = details;

            if (taxonomyTypeIdTaxonomyIds != null)
                _taxonomyHelper.UpdateTaxonomiesForEntity<ConstructionTaxonomy>(entity.Id, _entityTypeManager.Construction.Id, taxonomyTypeIdTaxonomyIds);

            Save();

            return entity;
        }

        public int Update(long projectId, ConstructionDetail[] details, Dictionary<long, long[]> taxonomyTypeIdTaxonomyIds = null, User user = null)
        {
            var entity = _constructionEntityHelper.Entity(projectId);
            entity.Name = _constructionEntityHelper.GenerateEntityName(details.FirstOrDefault(o => o.Field == "title")?.Value);

            _constructionEntityHelper.UpdateDetails(entity, details, user);

            _taxonomyHelper.UpdateTaxonomiesForEntity<ConstructionTaxonomy>(entity.Id, entity.EntityTypeId ?? 0, taxonomyTypeIdTaxonomyIds);

            return Save();
        }

        public int Deletes(long[] ids)
        {
            foreach (var id in ids)
            {
                var entity = _constructionEntityHelper.Entity(id);
                _constructionEntityHelper.Delete(entity);
            }

            return Save();
        }

        public IEnumerable<ConstructionViewModel> ToViewModels(IEnumerable<Construction> projects)
        {
            foreach (var project in projects)
            {
                var details = _constructionEntityHelper.GetDetails(project);
                yield return new ConstructionViewModel()
                {
                    Id = project.Id,
                    Title = details.FirstOrDefault(o => o.Field == "title")?.Value,
                    Thumbnail = _mediaHelper.GetThumbnailPath(details.FirstOrDefault(o => o.Field == "thumbnail")?.Value)
                };
            }
        }

        public int Save()
            => _dbContext.SaveChanges();
    }
}
