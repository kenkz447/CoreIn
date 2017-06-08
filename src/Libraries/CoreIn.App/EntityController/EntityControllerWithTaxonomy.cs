using CoreIn.Commons;
using CoreIn.Commons.EntityHelper;
using CoreIn.EntityCore;
using CoreIn.Media;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Models.Infrastructure;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;
using CoreIn.Commons.ViewModels;

namespace CoreIn.App
{
    public class EntityControllerWithTaxonomy<TEntity, TEntityDetail, TEntityTaxonomy, TLocalizer, TFormDetailViewModel> : 
        EntityController<TEntity, TEntityDetail, TLocalizer, TFormDetailViewModel>
        where TEntity: BaseEntity, IEntityWithDetails<TEntityDetail>, IEntityWithTaxonomies<TEntityTaxonomy>, new()
        where TEntityDetail: BaseEntityDetail, new()
        where TEntityTaxonomy: BaseEntityTaxonomy, new()
        where TFormDetailViewModel: class, new()
    {
        public ITaxonomyHelper TaxonomyHelper { get; }

        public EntityControllerWithTaxonomy(CoreInDbContext dbContext, 
            IEntityHelper<TEntity, TEntityDetail> fieldEntityHelper, 
            IMediaHelper mediaHelper,
            IStringLocalizer<TLocalizer> localizer,
            IOptions<RequestLocalizationOptions> localizationOptions,
            ITaxonomyHelper taxonomyHelper) 
            : base(dbContext, fieldEntityHelper, mediaHelper, localizer, localizationOptions)
        {
            TaxonomyHelper = taxonomyHelper;
        }

        public TEntity Create(TEntity newEntity, TEntityDetail[] details, Dictionary<long, long[]> taxonomyTypeIdTaxonomyIds = null, User user = null)
        {
            newEntity.Name = EntityHelper.GenerateEntityName(newEntity.Name);

            var entity = EntityHelper.Add(newEntity, user);

            if (details != null)
                EntityHelper.CreateDetails(entity, details, user);

            if (taxonomyTypeIdTaxonomyIds != null)
                TaxonomyHelper.UpdateTaxonomiesForEntity<TEntityTaxonomy>(entity.Id, newEntity.EntityTypeId ?? 0, taxonomyTypeIdTaxonomyIds);

            Save();

            return entity;
        }

        public int Update(long entityId, IEnumerable<TEntityDetail> details, Dictionary<long, long[]> taxonomyTypeIdTaxonomyIds = null, User user = null)
        {
            BaseEntityController.Update<TEntity,TEntityDetail,TEntityTaxonomy>(EntityHelper, TaxonomyHelper, entityId, details, taxonomyTypeIdTaxonomyIds, user);
            return Save();
        }

        public override IEnumerable<TEntity> GetEntities(DataRequest dataRequest)
        {
            var entities = base.GetEntities(dataRequest).ToList();
            var filteredEntities = new List<TEntity>();

            if (dataRequest.Taxonomies != null)
            {
                entities.ForEach(entity =>
                {
                    foreach (var kv in dataRequest.Taxonomies)
                    {
                        var taxonomies = TaxonomyHelper.GetTaxonomiesForEntity<TEntityTaxonomy>(entity.Id, kv.Key).Select(o => o.TaxonomyId);
                        if (taxonomies.Contains(kv.Value))
                        {
                            filteredEntities.Add(entity);
                            break;
                        }
                    }
                });
            }
            else
                filteredEntities = entities;

            return filteredEntities;
        }

        public override IEnumerable<BaseEntityViewModel> ToViewModels(IEnumerable<TEntity> entities)
        {
            var viewModels = base.ToViewModels(entities);

            foreach (var entity in entities)
            {
                var dic = new Dictionary<long, IEnumerable<TaxonomyViewModel>>();

                var taxonomyTypes = TaxonomyHelper.GetTaxonomyTypesForEntityType(entity.EntityTypeId ?? 0);
                foreach (var taxonomyType in taxonomyTypes)
                {
                    var entityTaxonomies = TaxonomyHelper.GetTaxonomiesForEntity<TEntityTaxonomy>(entity.Id, taxonomyType.Id).Select(o => o.TaxonomyId);

                    dic.Add(taxonomyType.Id, TaxonomyHelper.TaxonomiesToViewModels(TaxonomyHelper.GetTaxonomies(taxonomyType.Id, true).Where(o => entityTaxonomies.Contains(o.Id))));
                }
                var entityViewModel = viewModels.FirstOrDefault(o => o.GetId() == entity.Id);
                entityViewModel.SetTaxonomyTypes(dic);

                yield return entityViewModel;
            }
        }
    }
}
