using Microsoft.Extensions.DependencyInjection;
using CoreIn.Modular.Infrastructure;
using Microsoft.Extensions.Logging;

namespace CoreIn.Modules.Account
{
    public class ModularInitializer : IModuleInitializer
    {
        public void Init(IServiceCollection services)
        {
            services.AddSingleton<ILoggerFactory, LoggerFactory>();
            services.AddSingleton(typeof(ILogger<>), typeof(Logger<>));
        }
    }
}
