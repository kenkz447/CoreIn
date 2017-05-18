using System.Collections.Generic;
using Microsoft.Extensions.DependencyInjection;
using CoreIn.Modular.Infrastructure;
using CoreIn.Commons;
using CoreIn.Models.Authentication;
using CoreIn.Resources.ConstantKeys;
using Microsoft.AspNetCore.Identity;
using CoreIn.EntityCore;

namespace CoreIn.Modules.FileManager
{
    public class ModularInitializer : IModuleInitializer
    {
        private void InitDatabase(UserManager<User> userManager, IMenuHelper menuHelper, ITaxonomyHelper taxonomyHelper)
        {
            var supperUser = userManager.FindByNameAsync(AppKey.SupperAdminUserName).Result;
            var appMenu = menuHelper.Menu(AppKey.AppMenuName);

            taxonomyHelper.RegisterTaxonomyType(
                entityTypeName :AppKey.FileTypeImage, 
                name: "file-image-category", 
                detailDictionary: new Dictionary<string, string> {
                    { "title", "Category" }
                },
                byUser: supperUser);

            taxonomyHelper.RegisterTaxonomyType(
                entityTypeName: AppKey.FileTypeImage,
                name: "file-image-tag",
                detailDictionary: new Dictionary<string, string> {
                    { "title", "Tag" }
                },
                byUser: supperUser);

            menuHelper.MenuItem(
                menu: appMenu,
                name: "file-manager",
                detailDictionary: new Dictionary<string, string>
                {
                    {"title", "File Manager"},
                    {"controller", "filemanager"},
                    {"action", "index"},
                    {"url", "/filemanager"},
                    {"icon", "<i class=\"icon-docs icons\"></i>"}
                },
                byUser: supperUser);
        }

        public void Init(IServiceCollection services)
        {
            var serviceProvider = services.BuildServiceProvider();

            InitDatabase(
                serviceProvider.GetService<UserManager<User>>(), 
                serviceProvider.GetService<IMenuHelper>(),
                serviceProvider.GetService<ITaxonomyHelper>()
                );
        }
    }
}
