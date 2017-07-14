using System;
using System.ComponentModel.DataAnnotations.Schema;
using CoreIn.Models.Authentication;

namespace CoreIn.Models.Infrastructure
{
    public abstract class BaseEntityDetail : EntityWithTypedId<long>
    {
        public string TempId { get; set; }

        public string Prefix { get; set; }

        public string Suffix { get; set; }

        public string Group { get; set; }

        public string Field { get; set; }

        public string Value { get; set; }

        public long EntityId { get; set; }

        public string Language { get; set; }

        public long? ModifiedById { get; set; }

        public DateTime? Modified { get; set; }

        [ForeignKey("ModifiedById")]
        public User ModifiedBy { get; set; }

        public BaseEntityDetail Clone()
        {
            return this.MemberwiseClone() as BaseEntityDetail;
        }
    }
}
