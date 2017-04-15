using System.ComponentModel.DataAnnotations.Schema;
using CoreIn.Models.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CoreIn.Models
{
    public class EntityFieldDetail : BaseEntityDetail
    {
        [ForeignKey("EntityId")]
        public virtual EntityField Entity { get; set; }
    }
}
