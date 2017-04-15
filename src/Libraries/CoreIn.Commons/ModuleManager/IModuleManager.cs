using System.Collections.Generic;
using Microsoft.AspNetCore.Hosting;

namespace CoreIn.Commons
{
    public interface IModuleManager
    {
        string ModuleFolderName { get; }
        IEnumerable<ModuleInfo> LoadInstalledModules(IHostingEnvironment environment);
        IEnumerable<ModuleInfo> GetInstalledModules();
    }
}
