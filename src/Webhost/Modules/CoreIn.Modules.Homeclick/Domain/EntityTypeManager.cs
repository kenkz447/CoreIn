using CoreIn.Commons;
using CoreIn.EntityCore;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Resources.ConstantKeys;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.Homeclick
{
    public class EntityTypeManager
    {
        public EntityType Project { get; private set; }
        public EntityType Post { get; private set; }


        public EntityTypeManager(IEntityTypeManager entityTypeManager, UserManager<User> userManager)
        {
            var upperUser = userManager.FindByNameAsync(AppKey.SupperAdminUserName).Result;

            Project = entityTypeManager.RegisterEntityType(
                new EntityType { Name = "project" },
                new EntityTypeDetail[] {
                    new EntityTypeDetail{Field ="title", Value = "Project", Language = "en-US"},
                    new EntityTypeDetail{Field ="title", Value = "Dự Án", Language = "vi-VN"}
                }, upperUser, false);

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
