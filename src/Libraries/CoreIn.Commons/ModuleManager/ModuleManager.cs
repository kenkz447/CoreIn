using Microsoft.AspNetCore.Hosting;
using System.Collections.Generic;
using System.IO;
using System.Runtime.Loader;
using Newtonsoft.Json.Linq;
using System.Reflection;
using Microsoft.Extensions.DependencyModel;
using System.Linq;

namespace CoreIn.Commons
{
    public class ModuleManager : IModuleManager
    {
        public string ModuleFolderName { get; }

        public ModuleManager()
        {
            ModuleFolderName = "Modules";
        }

        private static IEnumerable<Assembly> GetReferencingAssemblies(string assemblyName)
        {
            var assemblies = new List<Assembly>();
            var dependencies = DependencyContext.Default.RuntimeLibraries;
            var a = dependencies.Select(o => o.Name);
            foreach (var library in dependencies)
            {
                if (library.Name == (assemblyName) || library.Dependencies.Any(d => d.Name.StartsWith(assemblyName)))
                {
                    var assembly = Assembly.Load(new AssemblyName(library.Name));
                    assemblies.Add(assembly);
                }
            }
            return assemblies;
        }

    
        private Dictionary<string, object> getModuleConfigureFormJsonFile(DirectoryInfo moduleFolder)
        {
            var moduleInfoValue = File.ReadAllText(Path.Combine(moduleFolder.FullName, "module.json"));
            var result = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, object>>(moduleInfoValue);
            return result;
        }

        public IEnumerable<ModuleInfo> LoadInstalledModules(IHostingEnvironment environment)
        {
            var moduleRootFolder = new DirectoryInfo(Path.Combine(environment.ContentRootPath, ModuleFolderName));
            var moduleFolders = moduleRootFolder.GetDirectories();
            var modules = new List<ModuleInfo>();

            foreach (var moduleFolder in moduleFolders)
            {
                var binFolder = new DirectoryInfo(Path.Combine(moduleFolder.FullName, "bin"));
                if (!binFolder.Exists)
                    continue;

                var moduleConfiglure = getModuleConfigureFormJsonFile(moduleFolder);
                if (!(bool)moduleConfiglure["active"])
                    continue;

                foreach (var file in binFolder.GetFileSystemInfos((string)moduleConfiglure["name"], SearchOption.AllDirectories))
                {
                    try
                    {
                        //var assembly = AssemblyLoadContext.Default.LoadFromAssemblyPath(file.FullName);
                        var assembly = GetReferencingAssemblies(Path.GetFileNameWithoutExtension(file.FullName).ToLower()).FirstOrDefault();
                        modules.Add(
                            new ModuleInfo {
                                Name = moduleFolder.Name,
                                Assembly = assembly,
                                Path = moduleFolder.FullName,
                                Scripts = moduleConfiglure.ContainsKey("scripts") ? ((JArray)moduleConfiglure["scripts"]).ToObject<List<string>>() : null,
                                Styles = moduleConfiglure.ContainsKey("styles") ? ((JArray)moduleConfiglure["styles"]).ToObject<List<string>>() : null,
                                Jsx = moduleConfiglure.ContainsKey("jsx") ? ((JArray)moduleConfiglure["jsx"]).ToObject<List<string>>() : null
                            });
                    }
                    catch (FileLoadException ex)
                    {
                        continue;
                    }
                }
            }
            ModuleStore.AddModules(modules);
            return modules;
        }

        public IEnumerable<ModuleInfo> GetInstalledModules()
        {
            return ModuleStore.Modules;
        }
    }
}
