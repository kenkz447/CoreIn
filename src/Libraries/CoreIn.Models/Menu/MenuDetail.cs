using System.ComponentModel.DataAnnotations.Schema;
using CoreIn.Models.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CoreIn.Models
{
    public class MenuDetail: BaseEntityDetail
    {
        public MenuDetail()
        {
            
        }

        [ForeignKey("EntityId")]
        public virtual Menu Menu { get; set; }
    }
}
