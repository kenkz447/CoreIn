using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.FileMagager.Infrastructure.ViewModels
{
    public class FileInfoViewModel
    {
        public string fileId { get; set; }

        public string fileName { get; set; }

        public IDictionary<string, string> meta { get; set; }
    }
}
