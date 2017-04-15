using System.ComponentModel.DataAnnotations.Schema;
using CoreIn.Models.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CoreIn.Models
{
    public class TaxonomyDetail: BaseEntityDetail
    {
        [ForeignKey("EntityId")]
        public virtual Taxonomy Entity { get; set; }
    }
}
