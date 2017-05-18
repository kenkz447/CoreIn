using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.Homeclick.Models
{
    public class ProjectDetail : BaseEntityDetail
    {
        public virtual Project Entity { get; set; }
    }
}
