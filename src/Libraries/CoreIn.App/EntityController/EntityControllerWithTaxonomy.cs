using CoreIn.Commons;
using CoreIn.Commons.EntityHelper;
using CoreIn.Commons.Form;
using CoreIn.Commons.ViewModels;
using CoreIn.EntityCore;
using CoreIn.Media.MediaHelper;
using CoreIn.Models.Authentication;
using CoreIn.Models.Infrastructure;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.App
{
    public class EntityControllerWithTaxonomy<TEntity, TEntityDetail, TTaxonomy, TLocalizer, TFormDetailViewModel> : EntityController<TEntity, TEntityDetail, TLocalizer, TFormDetailViewModel>
        where TEntity: BaseEntity
        where TEntityDetail: BaseEntityDetail
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
            var entity = EntityHelper.Entity(entityId);
            entity.Name = EntityHelper.GenerateEntityName(details.FirstOrDefault(o => o.Field == "title")?.Value);

            EntityHelper.UpdateDetails(entity, details, user);
            TaxonomyHelper.UpdateTaxonomiesForEntity<TTaxonomy>(entity.Id, entity.EntityTypeId ?? 0, taxonomyTypeIdTaxonomyIds);

            return Save();
        }
    }
}
