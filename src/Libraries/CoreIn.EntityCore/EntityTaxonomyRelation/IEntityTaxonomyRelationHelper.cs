using CoreIn.Models.Infrastructure;
using System.Collections.Generic;

namespace CoreIn.EntityCore
{
    public interface IEntityTaxonomyRelationHelper<TEntityTaxonomy> where TEntityTaxonomy : BaseEntityTaxonomy, new()
    {
        IEnumerable<TEntityTaxonomy> GetTaxonomiesForEntity(long entityId, long taxonomyTypeId);
        void RemoveTaxonomyFromEntity(IEnumerable<long> entityTaxonomyIds);
        void AddTaxonomiesToEntity(long entityId, long[] entityIdTaxonomyIds);
    }
}
