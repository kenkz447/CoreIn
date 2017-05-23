using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.Post.Models
{
    public class PostEntity : BaseEntity
    {
        public PostEntity()
        {
            Details = new HashSet<PostEntityDetail>();
        }

        public virtual ICollection<PostEntityDetail> Details { get; set; }
        public virtual ICollection<PostEntityTaxonomy> Taxonomies { get; set; }
    }
}