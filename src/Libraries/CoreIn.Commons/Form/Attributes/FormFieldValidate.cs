using System;
using System.Collections.Generic;
using System.Text;

namespace CoreIn.Commons.Form.Attributes
{
    public class FormFieldValidateAttribute : Attribute
    {
        public FieldValidate FieldValidate { get; }

        public FormFieldValidateAttribute(string Required = null)
        {
            this.FieldValidate = new FieldValidate
            {
                Required = Required
            };
        }
    }
}
