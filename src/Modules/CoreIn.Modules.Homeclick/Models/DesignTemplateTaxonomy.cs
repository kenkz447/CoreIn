using System.Collections.Generic;
using CoreIn.Models.Infrastructure;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoreIn.Modules.Homeclick.Models
{
    public class DesignTemplateTaxonomy : BaseEntityTaxonomy
    {
        [ForeignKey("EntityId")]
        public virtual DesignTemplate Entity  { get;set;}
    }
}