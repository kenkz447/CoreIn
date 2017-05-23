using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.Post.Models
{
    public class PostEntityDetail : BaseEntityDetail
    {
        public virtual PostEntity Entity { get; set; }
    }
}
