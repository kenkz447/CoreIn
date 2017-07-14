using CoreIn.EntityCore;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Resources.ConstantKeys;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace CoreIn.Modules.Post
{
    public class TaxonomyTypeManager
    {
        public TaxonomyType PostCategory { get; private set; }

        public TaxonomyTypeManager(EntityTypeManager entityTypeManager, ITaxonomyHelper taxonomyManager, UserManager<User> userManager)
        {
            var supperUser = userManager.FindByNameAsync(AppKey.SupperAdminUserName).Result;

            PostCategory = taxonomyManager.RegisterTaxonomyType(
                entityTypeManager.Liblary,
                "liblary-blog-category",
                new Dictionary<string, string>
                {
                    {"title", "Category" },
                }, supperUser);

            PostCategory = taxonomyManager.RegisterTaxonomyType(
                entityTypeManager.Liblary,
                "liblary-blog-tag",
                new Dictionary<string, string>
                {
                    {"title", "Tag" },
                }, supperUser);
        }
    }
}
