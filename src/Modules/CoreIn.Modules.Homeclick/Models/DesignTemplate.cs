using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.Homeclick.Models
{
    public class DesignTemplate : BaseEntity
    {
        public DesignTemplate()
        {
            Details = new HashSet<DesignTemplateDetail>();
        }

        public virtual ICollection<DesignTemplateDetail> Details { get; set; }
        public virtual ICollection<DesignTemplateTaxonomy> Taxonomies { get; set; }
    }
}