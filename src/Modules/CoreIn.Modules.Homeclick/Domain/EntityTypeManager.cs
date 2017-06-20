using CoreIn.EntityCore;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Resources.ConstantKeys;
using Microsoft.AspNetCore.Identity;

namespace CoreIn.Modules.Homeclick
{
    public class EntityTypeManager
    {
        public EntityType Project { get; private set; }
        public EntityType Construction { get; set; }
        public EntityType Collection { get; set; }

        public EntityTypeManager(IEntityTypeManager entityTypeManager, UserManager<User> userManager)
        {
            var upperUser = userManager.FindByNameAsync(AppKey.SupperAdminUserName).Result;

            Project = entityTypeManager.RegisterEntityType(
                new EntityType { Name = "project" },
                new EntityTypeDetail[] {
                    new EntityTypeDetail{Field ="title", Value = "Project", Language = "en-US"},
                    new EntityTypeDetail{Field ="title", Value = "Dự Án", Language = "vi-VN"}
                }, upperUser, false);

            Construction = entityTypeManager.RegisterEntityType(
            new EntityType { Name = "construction" },
            new EntityTypeDetail[] {
                    new EntityTypeDetail{ Field ="title", Value = "Construction", Language = "en-US"},
                    new EntityTypeDetail{ Field ="title", Value = "Công trình", Language = "vi-VN"},

                    new EntityTypeDetail{ Field ="group", Value = "Construction", Language = "en-US"},
                    new EntityTypeDetail{ Field ="group", Value = "Công trình", Language = "vi-VN"},

            }, upperUser);

            Collection = entityTypeManager.RegisterEntityType(
            new EntityType { Name = "collection" },
            new EntityTypeDetail[] {
                    new EntityTypeDetail{ Field ="title", Value = "Collection", Language = "en-US"},
                    new EntityTypeDetail{ Field ="title", Value = "Bộ sưu tập", Language = "vi-VN"},

                    new EntityTypeDetail{ Field ="group", Value = "Collection", Language = "en-US"},
                    new EntityTypeDetail{ Field ="group", Value = "Bộ sưu tập", Language = "vi-VN"},

            }, upperUser);
        }
    }
}
