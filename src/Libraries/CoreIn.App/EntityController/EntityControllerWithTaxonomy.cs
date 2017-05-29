using CoreIn.Commons;
using CoreIn.Commons.EntityHelper;
using CoreIn.EntityCore;
using CoreIn.Media;
using CoreIn.Models.Authentication;
using CoreIn.Models.Infrastructure;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using System.Collections.Generic;

namespace CoreIn.App
{
    public class EntityControllerWithTaxonomy<TEntity, TEntityDetail, TTaxonomy, TLocalizer, TFormDetailViewModel> : 
        EntityController<TEntity, TEntityDetail, TLocalizer, TFormDetailViewModel>
        where TEntity: BaseEntity, new()
        where TEntityDetail: BaseEntityDetail, new()
        where TTaxonomy: BaseEntityTaxonomy, new()
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
                TaxonomyHelper.UpdateTaxonomiesForEntity<TTaxonomy>(entity.Id, newEntity.EntityTypeId ?? 0, taxonomyTypeIdTaxonomyIds);

            Save();

            return entity;
        }

        public int Update(long entityId, IEnumerable<TEntityDetail> details, Dictionary<long, long[]> taxonomyTypeIdTaxonomyIds = null, User user = null)
        {
            BaseEntityController.Update<TEntity,TEntityDetail,TTaxonomy>(EntityHelper, TaxonomyHelper, entityId, details, taxonomyTypeIdTaxonomyIds, user);
            return Save();
        }
    }
}
