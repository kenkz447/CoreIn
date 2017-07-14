using CoreIn.EntityCore;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Resources.ConstantKeys;
using Microsoft.AspNetCore.Identity;

namespace CoreIn.Modules.Post
{
    public class EntityTypeManager
    {
        public EntityType Liblary { get; private set; }

        public EntityTypeManager(IEntityTypeManager entityTypeManager, UserManager<User> userManager)
        {
            var supperUser = userManager.FindByNameAsync(AppKey.SupperAdminUserName).Result;

            Liblary = entityTypeManager.RegisterEntityType(
                new EntityType { Name = "liblary" },
                new EntityTypeDetail[] {
                    new EntityTypeDetail{ Field ="title", Value = "Liblary", Language = "en-US"},
                    new EntityTypeDetail{ Field ="title", Value = "Thư viện", Language = "vi-VN"},

                    new EntityTypeDetail{ Field ="group", Value = "Liblary", Language = "en-US"},
                }, supperUser, false);
        }
    }
}
