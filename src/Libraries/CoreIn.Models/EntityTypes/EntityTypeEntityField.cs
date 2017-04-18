using System.Collections.Generic;
using CoreIn.Models.Infrastructure;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoreIn.Models
{
    public class EntityTypeEntityField : EntityWithTypedId<long>
    {
        public long EntityTypeId { get; set; }

        public long EntityFieldId { get; set; }

        public virtual EntityType FileEntity  { get;set;}

        public virtual EntityField EntityField { get; set; }
    }
}