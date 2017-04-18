using System.Collections.Generic;
using CoreIn.Models.Infrastructure;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoreIn.Models
{
    public class FileEntityTaxonomy : BaseEntityTaxonomy
    {
        [ForeignKey("EntityId")]
        public virtual FileEntity Entity  { get;set;}
    }
}