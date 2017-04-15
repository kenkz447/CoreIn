using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;

namespace CoreIn.Models
{
    public class EntityField : BaseEntity
    {
        public EntityField()
        {
            Details = new HashSet<EntityFieldDetail>();
        }

        public virtual EntityField Parent { get; set; }

        public virtual ICollection<EntityFieldDetail> Details { get; set; }
    }
}
