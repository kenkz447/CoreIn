using Microsoft.AspNetCore.Hosting;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using Microsoft.Extensions.DependencyModel;
using System.Linq;
using Microsoft.Extensions.Configuration;
using System;

namespace CoreIn.Commons
{
    public class ModuleManager
    {
        #region Singleton
        private static ModuleManager instance;

        public static ModuleManager GetInstance()
            => instance;

        public static ModuleManager CreateInstance(IHostingEnvironment environment, IConfigurationRoot configurationRoot)
        {
            if (instance != null)
                return instance;

            instance = new ModuleManager(environment, configurationRoot);
            return instance;
        }
        #endregion          

        private const string _moduleFolderName = "Modules";
        private readonly IConfigurationRoot _configurationRoot;

        public readonly string ModuleFolderName;

        public readonly string ModuleFolderPath;


        public IEnumerable<ModuleInfo> Modules { get; set; }

        protected ModuleManager(IHostingEnvironment environment, IConfigurationRoot configurationRoot)
        {
            var rootpath = Directory.GetParent(environment.ContentRootPath).FullName;

            var moduleRootFolder = new DirectoryInfo(Path.Combine(rootpath, _moduleFolderName));
            ModuleFolderPath = moduleRootFolder.FullName;

            _configurationRoot = configurationRoot;
        }

        private IEnumerable<Assembly> GetReferencingAssemblies(string assemblyName)
        {
            var assemblies = new List<Assembly>();
            var dependencies = DependencyContext.Default.RuntimeLibraries;
            var a = dependencies.Select(o => o.Name);
            foreach (var library in dependencies)
            {
                System.Diagnostics.Debug.WriteLine(library.Name);

                if (library.Name == (assemblyName))
                {
                    var assembly = Assembly.Load(new AssemblyName(library.Name));
                    assemblies.Add(assembly);
                }
            }
            return assemblies;
        }

        public IEnumerable<ModuleInfo> LoadModules()
        {
            var modules_ = _configurationRoot.GetSection("Modules").GetChildren().Select(x => x.Value).ToArray();

            var modules = new List<ModuleInfo>();
            foreach (var module in modules_)
            {
                try
                {
                    var assembly = GetReferencingAssemblies(module).FirstOrDefault();
                    modules.Add(
                        new ModuleInfo
                        {
                            Name = module,
                            Assembly = assembly,
                        });
                }
                catch (FileLoadException)
                {
                    continue;
                }
            }

            this.Modules = modules;

            return this.Modules;
        }
    }
}