using System;
using System.Collections.Generic;
using System.Text;
using CoreIn.Models;
using CoreIn.Commons.Infrastructure;
using CoreIn.Models.Infrastructure;
using CoreIn.Models.Authentication;

namespace CoreIn.EntityCore
{
    public interface IEntityTypeManager : IDbContextSetter
    {
        EntityType RegisterEntityType(string name, Dictionary<string,string> details, User byUser = null);
        EntityType RegisterEntityType(EntityType newEntityType, EntityTypeDetail[] details, User byUser = null, bool saveAfterFinishing = true);

        EntityType GetEntityType(long id);
        EntityType GetEntityType(string name);
        IEnumerable<EntityTypeDetail> GetEntityTypeDetails(EntityType entityType);
    }
}
