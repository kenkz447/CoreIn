using System.Collections.Generic;
using Microsoft.Extensions.DependencyInjection;
using CoreIn.Modular.Infrastructure;
using CoreIn.Commons;
using CoreIn.Models.Authentication;
using CoreIn.Resources.ConstantKeys;
using Microsoft.AspNetCore.Identity;
using CoreIn.EntityCore;

namespace CoreIn.Modules.TaxonomyUI
{
    public class ModularInitializer : IModuleInitializer
    {
        private void InitDatabase(UserManager<User> userManager, IMenuHelper menuHelper)
        {
            var supperUser = userManager.FindByNameAsync(AppKey.SupperAdminUserName).Result;
            var appMenu = menuHelper.Menu(AppKey.AppMenuName);

            menuHelper.MenuItem(
                menu: appMenu,
                name: "taxonomy-UI",
                detailDictionary: new Dictionary<string, string>
                {
                    {"title", "Taxonomies"},
                    {"controller", "taxonomyui"},
                    {"action", "index"},
                    {"url", "/taxonomyui"},
                    {"icon", "<i class=\"icon-list icons\"></i>"}
                },
                byUser: supperUser);
        }

        public void Init(IServiceCollection services)
        {
            var serviceProvider = services.BuildServiceProvider();
            InitDatabase(serviceProvider.GetService<UserManager<User>>(), serviceProvider.GetService<IMenuHelper>());
        }
    }
}
