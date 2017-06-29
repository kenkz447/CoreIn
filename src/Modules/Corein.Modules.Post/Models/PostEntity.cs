using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.Post.Models
{
    public class PostEntity : BaseEntity, 
        IEntityWithDetails<PostEntityDetail>,
        IEntityWithTaxonomies<PostEntityTaxonomy>
    {
        public PostEntity()
        {
            Details = new HashSet<PostEntityDetail>();
            Comments = new HashSet<PostComment>();
        }

        public virtual ICollection<PostComment> Comments { get; set; }
        public virtual ICollection<PostEntityDetail> Details { get; set; }
        public virtual ICollection<PostEntityTaxonomy> Taxonomies { get; set; }
    }
}