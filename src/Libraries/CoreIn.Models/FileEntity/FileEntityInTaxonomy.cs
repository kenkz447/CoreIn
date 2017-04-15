using System.Collections.Generic;
using CoreIn.Models.Infrastructure;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoreIn.Models
{
    public class FileEntityInTaxonomy : EntityWithTypedId<long>
    {
        public long FileEntityId { get; set; }

        public long TaxonomyId { get; set; }

        [ForeignKey("FileEntityId")]
        public FileEntity FileEntity  { get;set;}

        [ForeignKey("TaxonomyId")]
        public Taxonomy Taxonomy { get; set; }
    }
}