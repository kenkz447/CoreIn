using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CoreIn.Models.Infrastructure
{
    public abstract class BaseEntityTaxonomy : EntityWithTypedId<long>
    {
        public long EntityId { get; set; }
        public long TaxonomyId { get; set; }

        public virtual Taxonomy Taxonomy { get;set;}
    }
}