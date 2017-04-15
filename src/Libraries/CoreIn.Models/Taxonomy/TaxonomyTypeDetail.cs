using System.ComponentModel.DataAnnotations.Schema;
using CoreIn.Models.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CoreIn.Models
{
    public class TaxonomyTypeDetail: BaseEntityDetail
    {
        [ForeignKey("EntityId")]
        public virtual TaxonomyType Entity { get; set; }
    }
}
