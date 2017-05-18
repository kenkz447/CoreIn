using System.Collections.Generic;
using CoreIn.Models.Infrastructure;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoreIn.Modules.Homeclick.Models
{
    public class PostTaxonomy : BaseEntityTaxonomy
    {
        [ForeignKey("EntityId")]
        public virtual Post Entity  { get;set;}
    }
}