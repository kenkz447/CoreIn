using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using CoreIn.DataProviver;
using CoreIn.Modular;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Routing;
using React.AspNet;

namespace Webhost
{
    public class Startup
    {
        private readonly IHostingEnvironment _hostingEnvironment;

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();

            _hostingEnvironment = env;
        }

        public IConfigurationRoot Configuration { get; }

        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            var builder = new ContainerBuilder();

            var mvc = services
                .AddLanguageLocalization()
                .AddMvc()
                .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix);

            services.AddSingleton(provider => Configuration);

            services.AddModularConfigureServices();

            services.AddDataProviderServices();

            if (_hostingEnvironment.IsProduction())
            {

            }

            services.SeedDb().Wait();

            mvc.AddModules();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddReact();

            builder.RegisterInstance(Configuration);
            builder.RegisterInstance(_hostingEnvironment);
            builder.Populate(services);
            
            var container = builder.Build();
            return container.Resolve<IServiceProvider>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseDeveloperExceptionPage();

            if (env.IsDevelopment())
            {
                app.UseBrowserLink();
            }
            else
                app.UseExceptionHandler("/Home/Error");

            app.UseLanguageLocalization();

            app.UseReact(configure => { });

            app.UseModularConfigure();

            app.UseStaticFiles();

            app.UseIdentity();

            app.UseModularMvcRoutes();
        }
    }
}
