using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using CoreIn.Models.Authentication;

namespace CoreIn.Models.Infrastructure
{
    public abstract class BaseEntityDetail : EntityWithTypedId<long>
    {
        public string Prefix { get; set; }

        public string Suffix {get;set;}

        public string Group { get; set; }

        public string Field { get; set; }

        public string Value { get; set; }

        public long EntityId { get; set; }

        public string Language { get; set; }

        public long? ModifiedById { get; set; }

        public DateTime? Modified { get; set; }

        [ForeignKey("ModifiedById")]
        public User ModifiedBy { get; set; }
    }
}
