using System;
using System.Collections.Generic;
using System.Text;
using CoreIn.Models;
using CoreIn.Commons.Infrastructure;

namespace CoreIn.EntityCore
{
    public interface IEntityTypeManager : IDbContextSetter
    {
        EntityType RegisterEntityType(string name, Dictionary<string,string> details);
        EntityType GetEntityType(long id);
        EntityType GetEntityType(string name);
        IEnumerable<EntityTypeDetail> GetEntityTypeDetails(EntityType entityType);
    }
}
