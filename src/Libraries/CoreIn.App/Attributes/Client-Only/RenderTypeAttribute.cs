using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CoreIn.App.Attributes
{
    public enum RenderType { FormGroup, InputGroup, Checkbox}
    public class RenderAsAttribute : Attribute
    {
        public RenderType RenderType { get; }
        public RenderAsAttribute(RenderType renderType)
        {
            RenderType = renderType;
        }
    }
}