using CoreIn.Models.Infrastructure;
using System.Collections.Generic;

namespace CoreIn.Modules.Homeclick.Models
{
    public class Construction : BaseEntity, 
        IEntityWithDetails<ConstructionDetail>, 
        IEntityWithTaxonomies<ConstructionTaxonomy>
    {
        public Construction()
        {
            Details = new HashSet<ConstructionDetail>();
        }

        public virtual ICollection<ConstructionDetail> Details { get; set; }
        public virtual ICollection<ConstructionTaxonomy> Taxonomies { get; set; }
    }
}