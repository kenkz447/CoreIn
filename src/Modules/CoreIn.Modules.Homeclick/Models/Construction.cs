using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.Homeclick.Models
{
    public class Construction : BaseEntity, IBaseEntityWithDetails<ConstructionDetail>
    {
        public Construction()
        {
            Details = new HashSet<ConstructionDetail>();
        }

        public virtual ICollection<ConstructionDetail> Details { get; set; }
    }
}