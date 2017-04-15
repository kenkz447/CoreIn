using Microsoft.Extensions.DependencyInjection;

namespace CoreIn.Modular.Infrastructure
{
    public interface IModuleInitializer
    {
        void Init(IServiceCollection serviceCollection);
    }
}
