using System.Collections.Generic;

namespace CoreIn.Commons
{
    public static class ModuleStore
    {
        public static List<ModuleInfo> Modules {get;}

        static ModuleStore()
        {
            Modules = new List<ModuleInfo>();
        }

        public static void AddModules(IEnumerable<ModuleInfo> modules) 
        {
            Modules.AddRange(modules);
        }
    }
}
