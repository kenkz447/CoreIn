using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.App.Attributes
{
    public class CustomStringLengthAttribute : StringLengthAttribute
    {
        public CustomStringLengthAttribute() : this(128)
        {

        }

        public CustomStringLengthAttribute(int MaximumLength) : base(MaximumLength)
        {
            ErrorMessageResourceType = typeof(Resources.Strings);
            ErrorMessageResourceName = "StringLengthErrorMessage";
        }
    }
}
