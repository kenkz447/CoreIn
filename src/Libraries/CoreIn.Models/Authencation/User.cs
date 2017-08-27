using System;
using System.ComponentModel.DataAnnotations.Schema;
using CoreIn.Models.Infrastructure;
using Microsoft.AspNetCore.Identity;

namespace CoreIn.Models.Authentication
{
    public class User : IdentityUser<long>, IEntityWithTypedId<long>
    {
        public User()
        {
            CreatedOn = DateTime.Now;
        }

        public DateTime? CreatedOn { get; set; }

        [ForeignKey("CreateByUser")]
        public long? CreateBy { get; set; }

        public DateTime? UpdatedOn { get; set; }

        [ForeignKey("UpdateByUser")]
        public long? UpdateBy { get; set; }

        public virtual User CreateByUser { get; set; }

        public virtual User UpdateByUser { get; set; }
    }
}
