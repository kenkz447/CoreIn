using CoreIn.EntityCore;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Resources.ConstantKeys;
using Microsoft.AspNetCore.Identity;

namespace CoreIn.Modules.Post
{
    public class EntityTypeManager
    {
        public EntityType Post { get; private set; }

        public EntityTypeManager(IEntityTypeManager entityTypeManager, UserManager<User> userManager)
        {
            var upperUser = userManager.FindByNameAsync(AppKey.SupperAdminUserName).Result;
            Post = entityTypeManager.RegisterEntityType(
                new EntityType { Name = "post" },
                new EntityTypeDetail[] {
                    new EntityTypeDetail{ Field ="title", Value = "Post", Language = "en-US"},
                    new EntityTypeDetail{ Field ="title", Value = "Bài viết", Language = "vi-VN"},

                    new EntityTypeDetail{ Field ="group", Value = "Post", Language = "en-US"},
                    new EntityTypeDetail{ Field ="group", Value = "Bài viết", Language = "vi-VN"},

                }, upperUser);
        }
    }
}
