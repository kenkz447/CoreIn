using System.ComponentModel.DataAnnotations.Schema;
using CoreIn.Models.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CoreIn.Models
{
    public class EntityTypeDetail : BaseEntityDetail
    {
        [ForeignKey("EntityId")]
        public virtual EntityType Entity { get; set; }
    }
}
