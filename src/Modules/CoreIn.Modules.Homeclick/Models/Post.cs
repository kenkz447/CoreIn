using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.Homeclick.Models
{
    public class Post : BaseEntity
    {
        public Post()
        {
            Details = new HashSet<PostDetail>();
        }

        public virtual ICollection<PostDetail> Details { get; set; }
    }
}