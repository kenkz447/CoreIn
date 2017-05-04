using System;
using System.Collections.Generic;
using System.Text;

namespace CoreIn.Commons.Form.Attributes
{
    public class FormFieldStatusAttribute : Attribute
    {
        public FieldStatus FieldStatus { get; }

        public FormFieldStatusAttribute(int StatusCode)
        {
            FieldStatus = (FieldStatus)StatusCode;
        }
    }
}
