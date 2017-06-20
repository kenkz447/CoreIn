using CoreIn.EntityCore;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Resources.ConstantKeys;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace CoreIn.Modules.Homeclick
{
    public class TaxonomyTypeManager
    {
        public TaxonomyType ConstructionCategory { get; set; }
        public TaxonomyType CollectionCategory { get; set; }
        public TaxonomyType ProjectCategory { get; set; }

        public TaxonomyTypeManager(EntityTypeManager entityTypeManager, ITaxonomyHelper taxonomyManager, UserManager<User> userManager)
        {
            var supperUser = userManager.FindByNameAsync(AppKey.SupperAdminUserName).Result;

            ConstructionCategory = taxonomyManager.RegisterTaxonomyType(
                entityTypeManager.Construction,
                "construction-category",
                new Dictionary<string, string>
                {
                    {"title", "Category" },
                }, supperUser
                );

            ProjectCategory = taxonomyManager.RegisterTaxonomyType(
                entityTypeManager.Project,
                "project-category",
                new Dictionary<string, string>
                {
                    {"title", "Category" },
                }, supperUser
                );

            CollectionCategory = taxonomyManager.RegisterTaxonomyType(
                entityTypeManager.Collection,
                "collection-category",
                new Dictionary<string, string>
                {
                    {"title", "Category" },
                }, supperUser
                );
        }
    }
}
