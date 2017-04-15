using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Models.Infrastructure
{
    public class EntityWithTypedId<TId> : IEntityWithTypedId<TId>
    {
        [Key]
        public TId Id { get; protected set; }
    }
}
