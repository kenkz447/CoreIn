using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.Homeclick.Models
{
    public class AlbumDetail : BaseEntityDetail
    {
        public virtual Album Entity { get; set; }
    }
}