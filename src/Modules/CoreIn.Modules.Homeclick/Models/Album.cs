using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.Homeclick.Models
{
    public class Album : BaseEntity, IEntityWithDetails<AlbumDetail>
    {
        public Album()
        {
            Details = new HashSet<AlbumDetail>();
        }

        public virtual ICollection<AlbumDetail> Details { get; set; }
    }
}