using CoreIn.Commons;
using CoreIn.Commons.EntityHelper;
using CoreIn.Commons.Form;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using CoreIn.Resources.ConstantKeys;
using CoreIn.Models.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace CoreIn.EntityCore
{
    public class EntityTaxonomyRelationHelper<TEntityTaxonomy> : IEntityTaxonomyRelationHelper<TEntityTaxonomy>
         where TEntityTaxonomy : BaseEntityTaxonomy, new()
    {
        private readonly CoreInDbContext _dbContext;
        private readonly IRepository<TEntityTaxonomy> _entityTaxonomyRepo;

        public EntityTaxonomyRelationHelper(CoreInDbContext dbContext, IRepository<TEntityTaxonomy> entityTaxonomyRepo)
        {
            _dbContext = dbContext;

            _entityTaxonomyRepo = entityTaxonomyRepo;
            _entityTaxonomyRepo.SetContext(_dbContext);
        }

        public IEnumerable<TEntityTaxonomy> GetTaxonomiesForEntity(long entityId, long taxonomyTypeId)
        {
            var entityTaxonomies = _entityTaxonomyRepo.Query(o => o.EntityId == entityId && o.Taxonomy.TaxonomyTypeId == taxonomyTypeId).ToList();
            return entityTaxonomies;
        }

        public void RemoveTaxonomyFromEntity(IEnumerable<long> entityTaxonomyIds)
        {
            foreach (var entityTaxonomyId in entityTaxonomyIds)
            {
                var entity = _entityTaxonomyRepo.GetById(entityTaxonomyId);
                _entityTaxonomyRepo.SetState(entity, EntityState.Deleted);
            }
        }

        public void AddTaxonomiesToEntity(long entityId, long[] taxonomyIds)
        {
            foreach (var entityIdTaxonomyId in taxonomyIds)
            {
                _entityTaxonomyRepo.Add(new TEntityTaxonomy { EntityId = entityId, TaxonomyId = entityIdTaxonomyId });
            }
        }
    }
}
