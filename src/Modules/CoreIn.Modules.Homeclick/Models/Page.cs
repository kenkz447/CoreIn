using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.Homeclick.Models
{
    public class Page : BaseEntity
    {
        public Page()
        {
            Details = new HashSet<PageDetail>();
        }

        public virtual ICollection<PageDetail> Details { get; set; }
    }
}