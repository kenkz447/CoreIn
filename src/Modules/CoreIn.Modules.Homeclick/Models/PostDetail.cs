using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.Homeclick.Models
{
    public class PostDetail : BaseEntityDetail
    {
        public virtual Post Entity { get; set; }
    }
}
