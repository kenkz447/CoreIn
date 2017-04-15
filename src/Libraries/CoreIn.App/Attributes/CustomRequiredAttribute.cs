using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CoreIn.App.Attributes
{
    public class CustomRequiredAttribute : RequiredAttribute
    {
        public CustomRequiredAttribute()
        {
            ErrorMessageResourceType = typeof(Resources.Strings);
            ErrorMessageResourceName = "RequiredErrorMessage";
        }
    }

    public class CustomRequiredSpecialCharAttribute : ValidationAttribute
    {
        public CustomRequiredSpecialCharAttribute()
        {
            ErrorMessageResourceType = typeof(Resources.Strings);
            ErrorMessageResourceName = "RequiredSpecialCharErrorMessage";
        }

        public override bool IsValid(object value)
        {
            if (value is string)
            {
                var rgx = new Regex("(?=.*[!@#$%^&*])");
                return rgx.IsMatch(value.ToString());
            }
            return true;
        }
    }

    public class CustomRequiredUpperAttribute : ValidationAttribute
    {
        public CustomRequiredUpperAttribute()
        {
            ErrorMessageResourceType = typeof(Resources.Strings);
            ErrorMessageResourceName = "RequiredUpperErrorMessage";
        }
        public override bool IsValid(object value)
        {
            if (value is string)
            {
                var rgx = new Regex("(?=.*[A-Z])");
                return rgx.IsMatch(value.ToString());
            }
            return true;
        }
    }

    public class CustomRequiredLowerAttribute : ValidationAttribute
    {
        public CustomRequiredLowerAttribute()
        {
            ErrorMessageResourceType = typeof(Resources.Strings);
            ErrorMessageResourceName = "RequiredLowerErrorMessage";
        }
        public override bool IsValid(object value)
        {
            if (value is string)
            {
                var rgx = new Regex("(?=.*[a-z])");
                return rgx.IsMatch(value.ToString());
            }
            return true;
        }
    }

    public class CustomRequiredNumberAttribute : ValidationAttribute
    {
        public CustomRequiredNumberAttribute()
        {
            ErrorMessageResourceType = typeof(Resources.Strings);
            ErrorMessageResourceName = "RequiredNumberErrorMessage";
        }
        public override bool IsValid(object value)
        {
            if (value is string)
            {
                var rgx = new Regex("(?=.*[0-9])");
                return rgx.IsMatch(value.ToString());
            }
            return true;
        }
    }
}