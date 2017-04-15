using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CoreIn.App.Attributes
{
    public class ValidateTypeAttribute : Attribute
    {
        public DataType DataType { get; }
        public ValidateTypeAttribute(DataType dataType)
        {
            DataType = dataType;
        }

        public string FormatErrorMessage(string propertyName)
        {
            return String.Format(CultureInfo.CurrentCulture, Resources.Strings.ValidationTypeErrorMessage, propertyName);
        }
    }
}