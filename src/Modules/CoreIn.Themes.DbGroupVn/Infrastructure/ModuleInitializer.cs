using System.Collections.Generic;
using Microsoft.Extensions.DependencyInjection;
using CoreIn.Modular.Infrastructure;
using CoreIn.Models.Authentication;
using Microsoft.AspNetCore.Identity;
using CoreIn.EntityCore;
using CoreIn.Themes.DbGroupVn.Resources;
using CoreIn.Models;

namespace CoreIn.Themes.DbGroupVn
{
    public class ModularInitializer : IModuleInitializer
    {
        private void InitDatabase(UserManager<User> userManager, IMenuHelper menuHelper, EntityTypeManager entityTypeManager)
        {
        }

        public void Init(IServiceCollection services)
        {
            var serviceProvider = services.BuildServiceProvider();

            var userManager = serviceProvider.GetService<UserManager<User>>();
            var menuHelper = serviceProvider.GetService<IMenuHelper>();
            var entityTypeManager = services.BuildServiceProvider().GetService<EntityTypeManager>();

            InitDatabase(userManager, menuHelper, entityTypeManager);
        }
    }
}
