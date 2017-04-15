using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.App.Attributes
{
    public class TitleAttribute : Attribute
    {
        public string Title { get; }

        public TitleAttribute(string title)
        {
            Title = title;
        }
    }
}