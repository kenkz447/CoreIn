using System.Collections.Generic;

namespace CoreIn.Models.Infrastructure
{
    public interface IEntityWithTaxonomies<TTaxonomy>
        where TTaxonomy : BaseEntityTaxonomy
    {
        ICollection<TTaxonomy> Taxonomies { get; set; }
    }
}
