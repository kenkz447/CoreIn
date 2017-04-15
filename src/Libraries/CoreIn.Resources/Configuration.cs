using System.Globalization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace CoreIn.Modular
{
    public static class Configuration
    {
        public static IServiceCollection AddLanguageLocalization(this IServiceCollection services)
        {
            services.AddLocalization(options => options.ResourcesPath = "Localization");
            services.Configure<RequestLocalizationOptions>(opts =>
            {
                var supportedCultures = new[] {
                    new CultureInfo("en-US"),
                    new CultureInfo("fr-FR"),
                    new CultureInfo("vi-VN"),
                };
                opts.DefaultRequestCulture = new RequestCulture("fr-FR");
                opts.SupportedCultures = supportedCultures;
                opts.SupportedUICultures = supportedCultures;
            });
            return services;
        }

        public static IApplicationBuilder UseLanguageLocalization(this IApplicationBuilder app)
        {
            var options = app.ApplicationServices.GetService<IOptions<RequestLocalizationOptions>>();
            app.UseRequestLocalization(options.Value);
            return app;
        }
    }
}
