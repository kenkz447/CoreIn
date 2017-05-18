using System.Collections.Generic;
using CoreIn.Models.Infrastructure;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoreIn.Modules.Homeclick.Models
{
    public class ConstructionTaxonomy : BaseEntityTaxonomy
    {
        [ForeignKey("EntityId")]
        public virtual Construction Entity  { get;set;}
    }
}