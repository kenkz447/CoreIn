using CoreIn.Commons;
using CoreIn.Commons.EntityHelper;
using CoreIn.Models;
using System.Collections.Generic;

namespace CoreIn.EntityCore
{
    public class EntityTypeManager : IEntityTypeManager
    {
        private readonly IEntityHelper<EntityType, EntityTypeDetail> _entityTypeHelper;

        public EntityTypeManager(IEntityHelper<EntityType, EntityTypeDetail> entityTypeHelper)
        {
            _entityTypeHelper = entityTypeHelper;
        }

        public IEnumerable<EntityTypeDetail> GetEntityTypeDetails(EntityType entityType)
            => _entityTypeHelper.Details(entityType);

        public EntityType RegisterEntityType(string name, Dictionary<string, string> details)
        {
            var entityType = _entityTypeHelper.Entity(name);
            if (entityType == null)
            {
                entityType = new EntityType()
                {
                    Name = name
                };
                _entityTypeHelper.Add(entityType);
                if (details != null)
                    _entityTypeHelper.CreateDetails(entityType, details, null);
            }
            else if (details != null) {
                _entityTypeHelper.UpdateDetails(entityType, details, null);
            }

            return entityType;
        }

        public EntityType GetEntityType(long id)
            => _entityTypeHelper.Entity(id);

        public EntityType GetEntityType(string name)
            => _entityTypeHelper.Entity(name);
    }
}
