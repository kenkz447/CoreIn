using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using CoreIn.Models.Authentication;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Models.Infrastructure
{
    public abstract class BaseEntity: EntityWithTypedId<long>
    {
        [Required]
        public string Name { get; set; }

        public long? ParentId { get; set; }
        public long? OwnerId { get; set; }
        public long? EntityTypeId { get; set; }
        public int? Order { get; set; }
        public DateTime? Created { get; set; }

        [ForeignKey("EntityTypeId")]
        public virtual EntityType EntityType { get; set; }

        [ForeignKey("OwnerId")]
        public virtual User Owner { get; set; }
    }
}
