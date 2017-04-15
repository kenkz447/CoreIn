using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CoreIn.Models
{
    public class Taxonomy : BaseEntity
    {
        public Taxonomy()
        {
            Details = new HashSet<TaxonomyDetail>();
            Children = new HashSet<Taxonomy>();
        }

        public long TaxonomyTypeId { get; set; }

        [ForeignKey("TaxonomyTypeId")]
        public virtual TaxonomyType TaxonomyType { get; set; }

        [ForeignKey("ParentId")]
        public virtual Taxonomy Parent { get; set; }

        public virtual ICollection<TaxonomyDetail> Details { get; set; }

        public virtual ICollection<Taxonomy> Children { get; set; }
    }
}