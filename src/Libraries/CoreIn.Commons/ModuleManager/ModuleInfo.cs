using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace CoreIn.Commons
{
    public class ModuleInfo
    {
        public ModuleInfo()
        {
            this.Styles = new List<string>();
            this.Scripts = new List<string>();
        }

        public string Name { get; set; }

        public Assembly Assembly { get; set; }

        public string ShortName
        {
            get
            {
                return Name.Split('.').Last();
            }
        }

        public string Path { get; set; }

        public IEnumerable<string> Scripts { get; set; }
        public IEnumerable<string> Styles { get; set; }
        public IEnumerable<string> Jsx { get; set; }
    }
}
