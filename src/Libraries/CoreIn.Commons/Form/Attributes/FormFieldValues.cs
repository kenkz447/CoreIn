using System;
using System.Collections.Generic;
using System.Text;

namespace CoreIn.Commons.Form.Attributes
{
    [AttributeUsage(AttributeTargets.All, Inherited = false, AllowMultiple = true)]
    public class FormFieldValuesAttribute : Attribute
    {
        public string Key { get; set; }
        public string Value { get; set; }

        public FormFieldValuesAttribute()
        {

        }
    }
}
