using System.Collections.Generic;
using CoreIn.Models.Infrastructure;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoreIn.Modules.Homeclick.Models
{
    public class ProjectTaxonomy : BaseEntityTaxonomy
    {
        [ForeignKey("EntityId")]
        public virtual Project Entity  { get;set;}
    }
}