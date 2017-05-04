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
            Children = new HashSet<EntityType>();
        }

        public virtual ICollection<EntityTypeDetail> Details { get; set; }
        public virtual ICollection<EntityType> Children { get; set; }
    }
}
