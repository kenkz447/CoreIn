using CoreIn.Commons.EntityHelper;
using CoreIn.Models.Authentication;
using CoreIn.Models.Infrastructure;
using System.Collections.Generic;

namespace CoreIn.EntityCore
{
    public static class BaseEntityController
    {
        public static TEntity Update<TEntity, TEntityDetail, TEntityTaxonomy>(IEntityHelper<TEntity, TEntityDetail> entityHelper, ITaxonomyHelper taxonomyHelper, long entityId, IEnumerable<TEntityDetail> details, Dictionary<long, long[]> taxonomyTypeIdTaxonomyIds = null, User user = null, bool deleteExcept = true)
            where TEntity: BaseEntity, new()
            where TEntityDetail: BaseEntityDetail, new()
            where TEntityTaxonomy: BaseEntityTaxonomy, new()
        {
            var entity = entityHelper.Entity(entityId);
            //entity.Name = entityHelper.GenerateEntityName(details.FirstOrDefault(o => o.Field == "title")?.Value);

            entityHelper.UpdateDetails(entity, details, user, deleteExcept);
            taxonomyHelper.UpdateTaxonomiesForEntity<TEntityTaxonomy>(entity.Id, entity.EntityTypeId ?? 0, taxonomyTypeIdTaxonomyIds);
            return entity;
        }
    }
}
