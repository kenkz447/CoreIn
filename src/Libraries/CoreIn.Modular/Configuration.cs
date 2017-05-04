using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc.Razor;
using System.Reflection;
using System.IO;
using CoreIn.Commons;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.CodeAnalysis;
using CoreIn.Modular.Infrastructure;
using Microsoft.EntityFrameworkCore;
using CoreIn.EntityCore;

namespace CoreIn.Modular
{
    public static class Configuration
    {
        public static IServiceCollection AddModularConfigureServices(this IServiceCollection services, IHostingEnvironment hostingEnvironment)
        {
            services.AddTransient<IModuleManager,ModuleManager>();

            var serviceProvider = services.BuildServiceProvider();
            var moduleManager = serviceProvider.GetService<IModuleManager>();

            var modules = moduleManager.LoadInstalledModules(hostingEnvironment);

            services.Configure<RazorViewEngineOptions>(options =>
            {
                var assemblies = modules.Select(o => o.Assembly);
                var metaRefs = new List<MetadataReference>();
                foreach (var item in assemblies)
                {
                    metaRefs.Add(MetadataReference.CreateFromFile(item.Location));
                }
                ((List<MetadataReference>)options.AdditionalCompilationReferences).AddRange(metaRefs);
                options.ViewLocationExpanders.Add(new ModuleViewLocationExpander());
            });

            Commons.Configuration.ModuleManager = moduleManager;

            services.AddSingleton(new AppEntityTypes(services.BuildServiceProvider().GetService<IEntityTypeManager>()));

            return services;
        }

        public static IMvcBuilder AddModules(this IMvcBuilder mvcBuilder)
        {
            var moduleManager = Commons.Configuration.ModuleManager;

            var services = mvcBuilder.Services;
            var serviceProvider = services.BuildServiceProvider();

            var modules = moduleManager.GetInstalledModules();

            using (var serviceScope = serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var dbContext = serviceScope.ServiceProvider.GetService<CoreInDbContext>();
                var isMigration = dbContext.Database.GetPendingMigrations();
                if (!isMigration.Any())
                {
                    foreach (var module in modules)
                    {
                        mvcBuilder.AddApplicationPart(module.Assembly);

                        // Register dependency in modules
                        var a = module.Assembly.GetTypes();
                        var b = a.Where(x => typeof(IModuleInitializer).IsAssignableFrom(x));
                        var moduleInitializerType = b.FirstOrDefault();
                        if (moduleInitializerType != null && moduleInitializerType != typeof(IModuleInitializer))
                        {
                            var moduleInitializer = (IModuleInitializer) Activator.CreateInstance(moduleInitializerType);
                            moduleInitializer.Init(services);
                        }
                    }
                }
            }
            return mvcBuilder;
        }

        public static IApplicationBuilder UseModularConfigure(this IApplicationBuilder app)
        {
            var moduleManager = Commons.Configuration.ModuleManager;

            var modules = moduleManager.GetInstalledModules();

            // Serving static file for modules
            foreach (var module in modules)
            {
                var wwwrootDir = new DirectoryInfo(Path.Combine(module.Path, "wwwroot"));
                if (!wwwrootDir.Exists)
                    continue;

                app.UseStaticFiles(new StaticFileOptions()
                {
                    FileProvider = new PhysicalFileProvider(wwwrootDir.FullName),
                    RequestPath = ""
                });
            }

            return app;
        }

        public static IApplicationBuilder UseModularMvcRoutes(this IApplicationBuilder app)
        {
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Admin}/{action=Index}/{id?}");
                routes.MapRoute(
                    name: "admin",
                    template: "{area:exists}/{controller=Home}/{action=Index}/{id?}"
                    );
            });

            return app;
        }
    }
}
