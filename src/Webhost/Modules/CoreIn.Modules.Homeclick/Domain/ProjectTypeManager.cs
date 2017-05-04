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
    public class ProjectTypeManager
    {
        public EntityType Project { get; private set; }

        public EntityType Townhouse { get; private set; }
        public EntityType Apartment { get; private set; }
        public EntityType Villa { get; private set; }

        public EntityType Office { get; private set; }
        public EntityType Restaurant { get; private set; }
        public EntityType Hotel { get; private set; }
        public EntityType Other { get; private set; }

        public ProjectTypeManager(IEntityTypeManager entityTypeManager, UserManager<User> userManager)
        {
            var upperUser = userManager.FindByNameAsync(AppKey.SupperAdminUserName).Result;

            Townhouse = entityTypeManager.RegisterEntityType(
                new EntityType { Name = "townhouse" },
                new EntityTypeDetail[] {
                    new EntityTypeDetail{Field ="title", Value = "Townhouse", Language = "en-US"},
                    new EntityTypeDetail{Field ="title", Value = "Nhà Phố", Language = "vi-VN"},
                    new EntityTypeDetail{Field ="group", Value = "House", Language = "en-US"},
                    new EntityTypeDetail{Field ="group", Value = "Nhà ở", Language = "en-US"},
                }, upperUser, false);

            Apartment = entityTypeManager.RegisterEntityType(
                new EntityType { Name = "apartment" },
                new EntityTypeDetail[] {
                    new EntityTypeDetail{Field ="title", Value = "Apartment", Language = "en-US"},
                    new EntityTypeDetail{Field ="title", Value = "Căn Hộ", Language = "vi-VN"},
                    new EntityTypeDetail{Field ="group", Value = "House", Language = "en-US"},
                    new EntityTypeDetail{Field ="group", Value = "Nhà ở", Language = "en-US"},
                }, upperUser, false);

            Villa = entityTypeManager.RegisterEntityType(
                new EntityType { Name = "villa" },
                new EntityTypeDetail[] {
                    new EntityTypeDetail{Field ="title", Value = "Villa", Language = "en-US"},
                    new EntityTypeDetail{Field ="title", Value = "Biệt Thự", Language = "vi-VN"},
                    new EntityTypeDetail{Field ="group", Value = "House", Language = "en-US"},
                    new EntityTypeDetail{Field ="group", Value = "Nhà ở", Language = "en-US"},
                }, upperUser, false);

            Office = entityTypeManager.RegisterEntityType(
                new EntityType { Name = "office" },
                new EntityTypeDetail[] {
                    new EntityTypeDetail{Field ="title", Value = "Office", Language = "en-US"},
                    new EntityTypeDetail{Field ="title", Value = "Văn Phòng", Language = "vi-VN"}
                });

            Restaurant = entityTypeManager.RegisterEntityType(
                new EntityType { Name = "restaurant" },
                new EntityTypeDetail[] {
                    new EntityTypeDetail{Field ="title", Value = "Restaurant", Language = "en-US"},
                    new EntityTypeDetail{Field ="title", Value = "Nhà hàng", Language = "vi-VN"}
                }, upperUser, false);

            Hotel = entityTypeManager.RegisterEntityType(
                new EntityType { Name = "hotel" },
                new EntityTypeDetail[] {
                    new EntityTypeDetail{Field ="title", Value = "Hotel", Language = "en-US"},
                    new EntityTypeDetail{Field ="title", Value = "Khách sạn", Language = "vi-VN"}
                }, upperUser, false);

            Other = entityTypeManager.RegisterEntityType(
                new EntityType { Name = "other" },
                new EntityTypeDetail[] {
                    new EntityTypeDetail{Field ="title", Value = "Other", Language = "en-US"},
                    new EntityTypeDetail{Field ="title", Value = "Khác", Language = "vi-VN"}
                }, upperUser, false);

            var childTypes = new List<EntityType>() {
                Townhouse,
                Apartment,
                Villa,
                Office,
                Restaurant,
                Hotel,
                Other
            };

            Project = entityTypeManager.RegisterEntityType(
                new EntityType { Name = "project", Children = childTypes },
                new EntityTypeDetail[] {
                    new EntityTypeDetail{Field ="title", Value = "Project", Language = "en-US"},
                    new EntityTypeDetail{Field ="title", Value = "Dự Án", Language = "vi-VN"}
                }, upperUser);
        }
    }
}
