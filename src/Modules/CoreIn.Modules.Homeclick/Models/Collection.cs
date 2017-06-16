using CoreIn.Models.Infrastructure;
using System.Collections.Generic;

namespace CoreIn.Modules.Homeclick.Models
{
    public class Collection : BaseEntity, 
        IEntityWithDetails<CollectionDetail>,
        IEntityWithTaxonomies<CollectionTaxonomy>
    {
        public Collection()
        {
            Details = new HashSet<CollectionDetail>();
        }

        public virtual ICollection<CollectionDetail> Details { get; set; }
        public ICollection<CollectionTaxonomy> Taxonomies { get; set; }
    }
}