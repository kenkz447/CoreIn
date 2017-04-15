using CoreIn.Models.Infrastructure;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace CoreIn.Models.Authentication
{
    public class Role : IdentityRole<long>, IEntityWithTypedId<long>
    {
        public Role()
        {
        }

        public Role(string name)
        {
            Name = name;
        }
    }
}
