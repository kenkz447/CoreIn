using System.ComponentModel.DataAnnotations.Schema;
using CoreIn.Models.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CoreIn.Models
{
    public class FileEntityDetail : BaseEntityDetail
    {
        [ForeignKey("EntityId")]
        public virtual FileEntity Entity { get; set; }
    }
}
