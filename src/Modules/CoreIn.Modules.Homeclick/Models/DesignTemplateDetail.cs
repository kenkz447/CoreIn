using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.Homeclick.Models
{
    public class DesignTemplateDetail : BaseEntityDetail
    {
        public virtual DesignTemplate Entity { get; set; }
    }
}