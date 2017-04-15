using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreIn.Commons;
using CoreIn.Commons.EntityHelper;
using CoreIn.Media.MediaHelper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using CoreIn.Models.Authentication;
using Microsoft.AspNetCore.Identity;
using CoreIn.Resources.ConstantKeys;
using CoreIn.EntityCore;

namespace CoreIn.DataProviver
{
    public static class Configuration
    {
        public static IServiceCollection AddDataProviderServices(this IServiceCollection services)
        {
            var serviceProvider = services.BuildServiceProvider();
            var configuration = serviceProvider.GetService<IConfigurationRoot>();

            services.AddDbContext<CoreInDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddIdentity<User, Role>(options =>
                {
                    options.Cookies.ApplicationCookie.LoginPath = "/login";
                    options.Cookies.ApplicationCookie.LogoutPath = "/logout";
                })
                .AddEntityFrameworkStores<CoreInDbContext, long>()
                .AddDefaultTokenProviders();

            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped(typeof(IRepositoryWithTypedId<,>), typeof(RepositoryWithTypedId<,>));

            services.AddSingleton(typeof(IEntityTypeManager), typeof(EntityTypeManager));
            services.AddScoped(typeof(IEntityHelper<,>), typeof(EntityHelper<,>));
            services.AddSingleton(typeof(IMenuHelper), typeof(MenuHelper));
            services.AddSingleton(typeof(IMediaHelper), typeof(MediaHelper));
            services.AddSingleton(typeof(IEntityTypeManager), typeof(EntityTypeManager));
            services.AddSingleton(typeof(ITaxonomyHelper), typeof(TaxonomyHelper));

            return services;
        }

        private static readonly string[] Roles = { "Supper", "Administrator" };

        public static async Task<IServiceCollection> SeedDb(this IServiceCollection services)
        {
            var serviceProvider = services.BuildServiceProvider();
            using (var serviceScope = serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var dbContext = serviceScope.ServiceProvider.GetService<CoreInDbContext>();

                var isMigration = dbContext.Database.GetPendingMigrations();
                if (!isMigration.Any())
                {
                    await dbContext.Database.MigrateAsync();
                    SeedRoles(serviceProvider).Wait();
                    SeedUsers(serviceProvider).Wait();
                    AddRoleToUser(serviceProvider).Wait();
                    AddAppMenu(serviceProvider);
                }
            }
            return services;
        }


        private static async Task SeedRoles(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<Role>>();
            foreach (var role in Roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new Role(role));
            }
        }

        private static async Task SeedUsers(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
            if (userManager.FindByNameAsync(AppKey.SupperAdminUserName).Result == null)
            {
                var user = new User()
                {
                    UserName = AppKey.SupperAdminUserName,
                    Email = AppKey.SupperAdminEmail
                };
                await userManager.CreateAsync(user, AppKey.SupperAdminPassword);
            }
        }

        private static async Task AddRoleToUser(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
            var user = userManager.FindByNameAsync(AppKey.SupperAdminUserName).Result;
            await userManager.AddToRoleAsync(user, AppKey.SupperAdminRole);
        }

        private static void AddAppMenu(IServiceProvider serviceProvider)
        {
            var menuHelper = serviceProvider.GetService<IMenuHelper>();
            var menu = menuHelper.Menu(AppKey.AppMenuName);
            if (menu == null)
            {
                var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
                var supperUser = userManager.FindByNameAsync(AppKey.SupperAdminUserName).Result;

                menuHelper.Menu(AppKey.AppMenuName, null, null, supperUser);
            }
        }
    }
}
