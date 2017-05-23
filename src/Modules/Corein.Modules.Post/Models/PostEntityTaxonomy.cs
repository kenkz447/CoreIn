using System.Collections.Generic;
using CoreIn.Models.Infrastructure;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoreIn.Modules.Post.Models
{
    public class PostEntityTaxonomy : BaseEntityTaxonomy
    {
        [ForeignKey("EntityId")]
        public virtual PostEntity Entity  { get;set;}
    }
}