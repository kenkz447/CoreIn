using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;

namespace CoreIn.Models
{
    public class TaxonomyType : BaseEntity
    {
        public TaxonomyType()
        {
            Details = new HashSet<TaxonomyTypeDetail>();
            Children = new HashSet<TaxonomyType>();
            Taxonomies = new HashSet<Taxonomy>();
        }

        public virtual ICollection<TaxonomyTypeDetail> Details { get; set; }
        public virtual ICollection<TaxonomyType> Children { get; set; }
        public virtual ICollection<Taxonomy> Taxonomies { get; set; }
    }
}