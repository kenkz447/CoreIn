using System;
using System.Collections.Generic;
using System.Text;
using CoreIn.Models.Infrastructure;

namespace CoreIn.Models
{
    public class EntityType: BaseEntity
    {
        public EntityType()
        {
            Details = new HashSet<EntityTypeDetail>();
        }

        public virtual ICollection<EntityTypeDetail> Details { get; set; }
    }
}
