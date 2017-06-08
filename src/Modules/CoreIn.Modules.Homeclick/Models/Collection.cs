using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.Homeclick.Models
{
    public class Collection : BaseEntity, IEntityWithDetails<CollectionDetail>
    {
        public Collection()
        {
            Details = new HashSet<CollectionDetail>();
        }

        public virtual ICollection<CollectionDetail> Details { get; set; }
    }
}