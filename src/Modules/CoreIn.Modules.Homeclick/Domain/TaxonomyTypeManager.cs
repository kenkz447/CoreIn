﻿using CoreIn.EntityCore;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Resources.ConstantKeys;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace CoreIn.Modules.Homeclick
{
    public class TaxonomyTypeManager
    {
        public TaxonomyType PostCategory { get; private set; }
        public TaxonomyType ConstructionCategory { get; set; }
        public TaxonomyType CollectionCategory { get; set; }

        public TaxonomyTypeManager(EntityTypeManager entityTypeManager, ITaxonomyHelper taxonomyManager, UserManager<User> userManager)
        {
            var supperUser = userManager.FindByNameAsync(AppKey.SupperAdminUserName).Result;

            PostCategory = taxonomyManager.RegisterTaxonomyType(
                entityTypeManager.Post,
                "post-category",
                new Dictionary<string, string>
                {
                    {"title", "Category" },
                }, supperUser
                );

            ConstructionCategory = taxonomyManager.RegisterTaxonomyType(
                entityTypeManager.Construction,
                "construction-category",
                new Dictionary<string, string>
                {
                    {"title", "Category" },
                }, supperUser
                );

            ConstructionCategory = taxonomyManager.RegisterTaxonomyType(
                entityTypeManager.Project,
                "project-category",
                new Dictionary<string, string>
                {
                    {"title", "Category" },
                }, supperUser
                );

            ConstructionCategory = taxonomyManager.RegisterTaxonomyType(
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
