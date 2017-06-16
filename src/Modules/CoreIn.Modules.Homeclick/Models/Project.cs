using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.Homeclick.Models
{
    public class Project : BaseEntity, 
        IEntityWithDetails<ProjectDetail>,
        IEntityWithTaxonomies<ProjectTaxonomy>
    {
        public Project()
        {
            Details = new HashSet<ProjectDetail>();
        }

        public virtual ICollection<ProjectDetail> Details { get; set; }
        public virtual ICollection<ProjectTaxonomy> Taxonomies { get; set; }

    }
}