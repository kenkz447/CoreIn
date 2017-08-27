using System.Collections.Generic;
using Microsoft.Extensions.DependencyInjection;
using CoreIn.Modular.Infrastructure;
using CoreIn.Commons;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Resources.ConstantKeys;
using Microsoft.AspNetCore.Identity;
using CoreIn.EntityCore;
using CoreIn.App;

namespace CoreIn.Modules.App
{
    public class ModularInitializer : IModuleInitializer
    {
        private void InitDatabase(UserManager<User> userManager, IMenuHelper menuHelper)
        {
            var supperUser = userManager.FindByNameAsync(AppKey.SupperAdminUserName).Result;
            var appMenu = menuHelper.Menu(AppKey.AppMenuName);

            menuHelper.MenuItem(
                menu: appMenu,
                name: "dashboard",
                detailDictionary: new Dictionary<string, string>
                {
                    {"title", "Dashboard"},
                    {"controller", "dashboard"},
                    {"action", "index"},
                    {"url", "/dashboard"},
                    {"icon", "<i class=\"icon-speedometer\"></i>"}
                },
                byUser: supperUser);
        }

        public void Init(IServiceCollection services)
        {
            services.AddScoped(typeof(EntityController<,,,>));
            services.AddScoped(typeof(EntityControllerWithTaxonomy<,,,,>));

            var serviceProvider = services.BuildServiceProvider();

            this.InitDatabase(serviceProvider.GetService<UserManager<User>>(), serviceProvider.GetService<IMenuHelper>());
        }
    }
}
