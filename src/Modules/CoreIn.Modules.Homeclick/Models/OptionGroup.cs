using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.Homeclick.Models
{
    public class OptionGroup : BaseEntity, IEntityWithDetails<OptionGroupDetail>
    {
        public OptionGroup()
        {
            Details = new HashSet<OptionGroupDetail>();
        }

        public virtual ICollection<OptionGroupDetail> Details { get; set; }
    }
}